const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const logRoutes = require('./routes/logRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dsaRoutes = require('./routes/dsaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/logs', logRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dsa', dsaRoutes);

// Connect DB and Start Server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
