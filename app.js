const express = require('express');
const dotenv = require('dotenv');

/* Custom Module */
const routes = require('./src/route');
const connectDB = require('./src/database_config');

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;

/* Initialize Routes & view Engine */
routes(app);

/* Database connection */
connectDB();


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
