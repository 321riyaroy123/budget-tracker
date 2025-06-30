const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
app.use(limiter);

app.use('/api', require('./routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
