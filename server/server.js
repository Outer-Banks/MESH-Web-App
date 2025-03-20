const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/startup', require('./routes/startup'));
app.use('/api/connections', require('./routes/connections'));
app.use('/api/investment-proposals', require('./routes/investmentProposals'));

// Base route
app.get('/', (req, res) => {
  res.send('MESH API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
