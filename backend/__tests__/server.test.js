/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const request = require('supertest');
const axios = require('axios');

const app = require('../server');

jest.mock('axios');

describe('API Endpoints', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/recipes/complexSearch', () => {
    it('should fetch complex search recipes successfully', async () => {
      const mockData = { results: [{ id: 1, title: 'Spaghetti Bolognese' }] };
      axios.get.mockResolvedValue({ data: mockData });

      const res = await request(app)
        .get('/api/recipes/complexSearch')
        .query({ query: 'pasta' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch',
        {
          headers: {
            'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          },
          params: { query: 'pasta' },
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const res = await request(app)
        .get('/api/recipes/complexSearch')
        .query({ query: 'pasta' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch complex search recipes.');
    });
  });

  describe('GET /api/recipes/random', () => {
    it('should fetch random recipes successfully', async () => {
      const mockData = { recipes: [{ id: 2, title: 'Chicken Curry' }] };
      axios.get.mockResolvedValue({ data: mockData });

      const res = await request(app)
        .get('/api/recipes/random')
        .query({ number: 1 });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random',
        {
          headers: {
            'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          },
          params: { number: '1' },
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const res = await request(app)
        .get('/api/recipes/random')
        .query({ number: 1 });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch random recipes.');
    });
  });

  describe('GET /api/recipes/:id/information', () => {
    it('should fetch recipe information successfully', async () => {
      const mockData = { id: 1, title: 'Spaghetti Bolognese', nutrition: { calories: 500 } };
      axios.get.mockResolvedValue({ data: mockData });

      const res = await request(app)
        .get('/api/recipes/1/information')
        .query({ includeNutrition: true });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/1/information',
        {
          headers: {
            'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          },
          params: { includeNutrition: 'true' },
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const res = await request(app)
        .get('/api/recipes/1/information')
        .query({ includeNutrition: true });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch recipe information.');
    });
  });

  describe('GET /api/recipes/informationBulk', () => {
    it('should fetch bulk recipe information successfully', async () => {
      const mockData = [
        { id: 1, title: 'Spaghetti Bolognese', nutrition: { calories: 500 } },
        { id: 2, title: 'Chicken Curry', nutrition: { calories: 600 } },
      ];
      axios.get.mockResolvedValue({ data: mockData });

      const res = await request(app)
        .get('/api/recipes/informationBulk')
        .query({ ids: '1,2' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockData);
      expect(axios.get).toHaveBeenCalledWith(
        'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk',
        {
          headers: {
            'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
            'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
          },
          params: {
            ids: '1,2',
            includeNutrition: true,
          },
        }
      );
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('API Error'));

      const res = await request(app)
        .get('/api/recipes/informationBulk')
        .query({ ids: '1,2' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch bulk recipe information.');
    });
  });

  describe('GET /', () => {
    it('should return health check message', async () => {
      const res = await request(app).get('/');

      expect(res.statusCode).toEqual(200);
      expect(res.text).toBe('Backend Server is Running.');
    });
  });
});
