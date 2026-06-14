import api from './api';

const gamesService = {
  getAllGames: async (params = {}) => {
    return api.get('/api/v1/games', { params });
  },

  getGameById: async (appid) => {
    return api.get(`/api/v1/games/${appid}`);
  },

  createGame: async (gameData) => {
    return api.post('/api/v1/games', gameData);
  },

  updateGame: async (appid, gameData) => {
    return api.patch(`/api/v1/games/${appid}`, gameData);
  },

  deleteGame: async (appid) => {
    return api.delete(`/api/v1/games/${appid}`);
  },

  archiveGame: async (appid) => {
    return api.patch(`/api/v1/games/${appid}/archive`);
  },

  restoreGame: async (appid) => {
    return api.patch(`/api/v1/games/${appid}/restore`);
  },

  getGameUpdates: async (appid) => {
    return api.get(`/api/v1/games/${appid}/updates`);
  },

  getLatestNews: async () => {
    return api.get('/api/v1/news/latest');
  },
  
  getFilterOptions: async () => {
    return api.get('/api/v1/games/filter');
  }
};

export default gamesService;
