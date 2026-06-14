import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gamesService from '../services/gamesService';

const initialState = {
  games: [],
  selectedGame: null,
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  filters: {
    genre: '',
    sort: 'title',
    platform: '',
    search: '',
  },
  news: [],
  updates: [],
  loading: false,
  error: null,
};

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (params, { getState, rejectWithValue }) => {
    try {
      const state = getState().games;
      // Merge passed params with state filters & pagination
      const queryParams = {
        page: state.currentPage,
        limit: state.limit,
        genre: state.filters.genre,
        sort: state.filters.sort,
        platform: state.filters.platform,
        // search endpoint uses `q` instead of search query parameter
        q: state.filters.search,
        ...params,
      };

      let response;
      if (queryParams.q) {
        // Use search endpoint if search term exists
        response = await gamesService.getAllGames({ ...queryParams, title: queryParams.q });
      } else {
        response = await gamesService.getAllGames(queryParams);
      }
      
      // Response shape: { success: true, message: "...", data: { games, totalCount, totalPages, currentPage, limit } }
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGameById = createAsyncThunk(
  'games/fetchGameById',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gamesService.getGameById(appid);
      return response.data.game;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createGame = createAsyncThunk(
  'games/createGame',
  async (gameData, { rejectWithValue }) => {
    try {
      const response = await gamesService.createGame(gameData);
      return response.data.game;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateGame = createAsyncThunk(
  'games/updateGame',
  async ({ appid, gameData }, { rejectWithValue }) => {
    try {
      const response = await gamesService.updateGame(appid, gameData);
      return response.data.game;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteGame = createAsyncThunk(
  'games/deleteGame',
  async (appid, { rejectWithValue }) => {
    try {
      await gamesService.deleteGame(appid);
      return appid;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const archiveGame = createAsyncThunk(
  'games/archiveGame',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gamesService.archiveGame(appid);
      return response.data.game;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const restoreGame = createAsyncThunk(
  'games/restoreGame',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gamesService.restoreGame(appid);
      return response.data.game;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchLatestNews = createAsyncThunk(
  'games/fetchLatestNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gamesService.getLatestNews();
      return response.data.items || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchGameUpdates = createAsyncThunk(
  'games/fetchGameUpdates',
  async (appid, { rejectWithValue }) => {
    try {
      const response = await gamesService.getGameUpdates(appid);
      return response.data.updates || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to page 1 on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
      state.updates = [];
    },
    clearGamesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games list
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload.games;
        state.totalCount = action.payload.totalCount || action.payload.total || 0;
        state.totalPages = action.payload.totalPages || action.payload.pages || 1;
        state.currentPage = action.payload.currentPage || action.payload.page || 1;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Game
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Game
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.games.unshift(action.payload);
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Game
      .addCase(updateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGame.fulfilled, (state, action) => {
        state.loading = false;
        const updatedGame = action.payload;
        state.games = state.games.map((g) => (g.appid === updatedGame.appid ? updatedGame : g));
        if (state.selectedGame && state.selectedGame.appid === updatedGame.appid) {
          state.selectedGame = updatedGame;
        }
      })
      .addCase(updateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Game
      .addCase(deleteGame.fulfilled, (state, action) => {
        const deletedAppid = action.payload;
        state.games = state.games.filter((g) => g.appid !== deletedAppid);
        if (state.selectedGame && state.selectedGame.appid === deletedAppid) {
          state.selectedGame = null;
        }
      })

      // Archive Game
      .addCase(archiveGame.fulfilled, (state, action) => {
        const updatedGame = action.payload;
        state.games = state.games.map((g) => (g.appid === updatedGame.appid ? updatedGame : g));
        if (state.selectedGame && state.selectedGame.appid === updatedGame.appid) {
          state.selectedGame = updatedGame;
        }
      })

      // Restore Game
      .addCase(restoreGame.fulfilled, (state, action) => {
        const updatedGame = action.payload;
        state.games = state.games.map((g) => (g.appid === updatedGame.appid ? updatedGame : g));
        if (state.selectedGame && state.selectedGame.appid === updatedGame.appid) {
          state.selectedGame = updatedGame;
        }
      })

      // Latest News
      .addCase(fetchLatestNews.fulfilled, (state, action) => {
        state.news = action.payload;
      })

      // Game Updates / Logs
      .addCase(fetchGameUpdates.fulfilled, (state, action) => {
        state.updates = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setCurrentPage, clearSelectedGame, clearGamesError } = gamesSlice.actions;
export default gamesSlice.reducer;
