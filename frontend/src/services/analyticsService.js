import api from './api';

const analyticsService = {
  // Stats endpoints
  getTotalCount: async () => {
    return api.get('/api/v1/stats/games/count');
  },
  
  getAveragePrice: async () => {
    return api.get('/api/v1/stats/games/average-price');
  },
  
  getAverageRating: async () => {
    return api.get('/api/v1/stats/games/average-rating');
  },
  
  getGenreCount: async () => {
    return api.get('/api/v1/stats/games/genre-count');
  },
  
  getPlatformCount: async () => {
    return api.get('/api/v1/stats/games/platform-count');
  },
  
  // Analytics endpoints
  getRevenueAnalysis: async () => {
    return api.get('/api/v1/analytics/games/revenue');
  },
  
  getPlatformDistribution: async () => {
    return api.get('/api/v1/analytics/games/platform-distribution');
  },
  
  getGenreDistribution: async () => {
    return api.get('/api/v1/analytics/games/genre-distribution');
  },
  
  getTrendingGames: async () => {
    return api.get('/api/v1/analytics/games/trending');
  },

  getTopRatedGames: async () => {
    return api.get('/api/v1/analytics/games/top-rated');
  },

  getMostDownloadedGames: async () => {
    return api.get('/api/v1/analytics/games/most-downloaded');
  }
};

export default analyticsService;
