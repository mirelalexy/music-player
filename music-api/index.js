import express from 'express';
import cors from 'cors';
import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // load environment variables
const app = express();
app.use(cors()); // enable CORS for cross-origin requests
app.use(express.json()); // parse JSON in requests
const PORT = process.env.PORT || 3001;

// set up PostgreSQL client
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// get all songs
app.get('/songs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songs');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});