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
        totalCount: countRes.data.total || 0,
        averagePrice: priceRes.data.avgPrice || 0,
        averageRating: ratingRes.data.avgRating || 0,
        genreCounts: genreRes.data.data || [],
        platformCounts: platformRes.data.data || {},
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

      // Calculate total count of genres to compute percentage
      const rawGenres = genreRes.data.data || [];
      const totalGenreGames = rawGenres.reduce((sum, g) => sum + (g.count || 0), 0) || 1;
      const genreDistribution = rawGenres.map(g => ({
        name: String(g._id).toUpperCase(),
        count: g.count,
        percentage: (g.count / totalGenreGames) * 100
      }));

      // Calculate total count of platforms to compute percentage
      const rawPlatformFacet = platformRes.data.data && platformRes.data.data[0] ? platformRes.data.data[0] : null;
      let platformDistribution = [];
      if (rawPlatformFacet) {
        const winCount = rawPlatformFacet.windows && rawPlatformFacet.windows[0] ? rawPlatformFacet.windows[0].count : 0;
        const macCount = rawPlatformFacet.mac && rawPlatformFacet.mac[0] ? rawPlatformFacet.mac[0].count : 0;
        const linuxCount = rawPlatformFacet.linux && rawPlatformFacet.linux[0] ? rawPlatformFacet.linux[0].count : 0;
        const totalPlatGames = (winCount + macCount + linuxCount) || 1;
        platformDistribution = [
          { name: 'WINDOWS', percentage: (winCount / totalPlatGames) * 100 },
          { name: 'MAC', percentage: (macCount / totalPlatGames) * 100 },
          { name: 'LINUX', percentage: (linuxCount / totalPlatGames) * 100 }
        ];
      }

      return {
        revenueAnalysis: revenueRes.data.data || [],
        platformDistribution: platformDistribution,
        genreDistribution: genreDistribution,
        trendingGames: trendingRes.data.data || [],
        topRatedGames: topRatedRes.data.data || [],
        mostDownloadedGames: mostDownloadedRes.data.data || [],
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
