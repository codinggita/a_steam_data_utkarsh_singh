import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchGames,
  fetchGameById,
  createGame,
  updateGame,
  deleteGame,
  archiveGame,
  restoreGame,
  fetchLatestNews,
  fetchGameUpdates,
  setFilters,
  resetFilters,
  setCurrentPage,
  clearSelectedGame,
  clearGamesError,
} from '../store/gamesSlice';

export const useGames = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.games);

  const loadGames = useCallback(
    async (params) => {
      const result = await dispatch(fetchGames(params));
      return result.payload;
    },
    [dispatch]
  );

  const loadGameById = useCallback(
    async (appid) => {
      const result = await dispatch(fetchGameById(appid));
      return result.payload;
    },
    [dispatch]
  );

  const addNewGame = useCallback(
    async (gameData) => {
      const result = await dispatch(createGame(gameData));
      return result.payload;
    },
    [dispatch]
  );

  const editGame = useCallback(
    async (appid, gameData) => {
      const result = await dispatch(updateGame({ appid, gameData }));
      return result.payload;
    },
    [dispatch]
  );

  const removeGame = useCallback(
    async (appid) => {
      const result = await dispatch(deleteGame(appid));
      return result.payload;
    },
    [dispatch]
  );

  const archiveGameEntry = useCallback(
    async (appid) => {
      const result = await dispatch(archiveGame(appid));
      return result.payload;
    },
    [dispatch]
  );

  const restoreGameEntry = useCallback(
    async (appid) => {
      const result = await dispatch(restoreGame(appid));
      return result.payload;
    },
    [dispatch]
  );

  const loadLatestNews = useCallback(async () => {
    const result = await dispatch(fetchLatestNews());
    return result.payload;
  }, [dispatch]);

  const loadGameUpdates = useCallback(
    async (appid) => {
      const result = await dispatch(fetchGameUpdates(appid));
      return result.payload;
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const changePage = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const unloadSelectedGame = useCallback(() => {
    dispatch(clearSelectedGame());
  }, [dispatch]);

  const clearErrors = useCallback(() => {
    dispatch(clearGamesError());
  }, [dispatch]);

  return {
    ...state,
    loadGames,
    loadGameById,
    addNewGame,
    editGame,
    removeGame,
    archiveGameEntry,
    restoreGameEntry,
    loadLatestNews,
    loadGameUpdates,
    updateFilters,
    clearFilters,
    changePage,
    unloadSelectedGame,
    clearErrors,
  };
};

export default useGames;
