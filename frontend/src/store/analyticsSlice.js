import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import analyticsService from '../services/analyticsService';

const initialState = {
  stats: {
    totalCount: 0,
    averagePrice: 0,
    averageRating: 0,
    genreCounts: [],
    platformCounts: [],
  },
  charts: {
    revenueAnalysis: [],
    platformDistribution: [],
    genreDistribution: [],
    trendingGames: [],
    topRatedGames: [],
    mostDownloadedGames: [],
  },
  loading: false,
  error: null,
};

export const fetchStatsSummary = createAsyncThunk(
  'analytics/fetchStatsSummary',
  async (_, { rejectWithValue }) => {
    try {
      const [countRes, priceRes, ratingRes, genreRes, platformRes] = await Promise.all([
        analyticsService.getTotalCount(),
        analyticsService.getAveragePrice(),
        analyticsService.getAverageRating(),
        analyticsService.getGenreCount(),
        analyticsService.getPlatformCount(),
      ]);

      return {
        totalCount: countRes.data.count || 0,
        averagePrice: priceRes.data.averagePrice || 0,
        averageRating: ratingRes.data.averageRating || 0,
        genreCounts: genreRes.data.genres || [],
        platformCounts: platformRes.data.platforms || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDashboardChartsData = createAsyncThunk(
  'analytics/fetchDashboardChartsData',
  async (_, { rejectWithValue }) => {
    try {
      const [revenueRes, platformRes, genreRes, trendingRes, topRatedRes, mostDownloadedRes] = await Promise.all([
        analyticsService.getRevenueAnalysis(),
        analyticsService.getPlatformDistribution(),
        analyticsService.getGenreDistribution(),
        analyticsService.getTrendingGames(),
        analyticsService.getTopRatedGames(),
        analyticsService.getMostDownloadedGames(),
      ]);

      return {
        revenueAnalysis: revenueRes.data.revenue || [],
        platformDistribution: platformRes.data.distribution || [],
        genreDistribution: genreRes.data.distribution || [],
        trendingGames: trendingRes.data.games || [],
        topRatedGames: topRatedRes.data.games || [],
        mostDownloadedGames: mostDownloadedRes.data.games || [],
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats Summary
      .addCase(fetchStatsSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatsSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStatsSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Dashboard Charts Data
      .addCase(fetchDashboardChartsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardChartsData.fulfilled, (state, action) => {
        state.loading = false;
        state.charts = action.payload;
      })
      .addCase(fetchDashboardChartsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
