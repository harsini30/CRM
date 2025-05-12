const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from frontend (localhost:3000)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  preflightContinue: false, // Make sure Express handles OPTIONS requests
  optionsSuccessStatus: 200, // Ensure compatibility with older browsers
};

// Enable CORS with the specified options
app.use(cors(corsOptions)); // Apply CORS middleware
app.use(bodyParser.json()); // Parse JSON bodies

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Roxy@2023', // Replace with your MySQL root password
  database: 'crm_platform', // Ensure the database name is correct
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Routes

// Respond to preflight OPTIONS request (CORS preflight)
app.options('*', cors(corsOptions));  // Respond to OPTIONS requests for all routes

// GET all customers
app.get('/api/customers', (req, res) => {
  connection.query('SELECT * FROM customers', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Send customers as JSON
  });
});

// POST a new customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone } = req.body;
  const query = 'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)';

  connection.query(query, [name, email, phone], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      phone,
    });
  });
});

// GET customer by ID
app.get('/api/customers/:id', (req, res) => {
  const { id } = req.params;  // Get the ID from the request parameters
  connection.query('SELECT * FROM customers WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(result[0]); // Send customer data
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
