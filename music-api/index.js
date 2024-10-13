import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
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

// get a song by ID
app.get('/songs/:id', async (req, res) => {
    const { id } = req.params;  // extract song ID from the URL
    try {
      const result = await pool.query('SELECT * FROM songs WHERE id_song = $1', [id]); // prevent SQL injection
      if (result.rows.length > 0) { // if there's at least 1 row returned by the query
        res.json(result.rows[0]); // since the result is 1 song with that ID, only first row is needed
      } else {
        res.status(404).json({ error: 'Song not found' });
      }
    } catch (error) {
      console.error('Error fetching song by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});