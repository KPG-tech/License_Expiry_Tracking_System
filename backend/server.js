const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const licenseRoutes = require('./routes/licenses');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);

// Catch-all 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
