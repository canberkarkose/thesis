/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(express.json());

// Proxy Endpoint for Complex Search
app.get('/api/recipes/complexSearch', async (req, res) => {
  try {
    const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch', {
      headers: {
        'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in complexSearch:', error.message);
    res.status(500).json({ error: 'Failed to fetch complex search recipes.' });
  }
});

// Proxy Endpoint for Random Recipes
app.get('/api/recipes/random', async (req, res) => {
  try {
    const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random', {
      headers: {
        'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in randomRecipes:', error.message);
    res.status(500).json({ error: 'Failed to fetch random recipes.' });
  }
});

// Proxy Endpoint for Recipe Information
app.get('/api/recipes/:id/information', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`, {
      headers: {
        'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in recipeInformation:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipe information.' });
  }
});

// Proxy Endpoint for Bulk Recipe Information
app.get('/api/recipes/informationBulk', async (req, res) => {
  try {
    const { ids } = req.query;
    const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk', {
      headers: {
        'x-rapidapi-key': process.env.SPOONACULAR_API_KEY,
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
      params: {
        ids,
        includeNutrition: true
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in informationBulk:', error.message);
    res.status(500).json({ error: 'Failed to fetch bulk recipe information.' });
  }
});

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Backend Server is Running.');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
