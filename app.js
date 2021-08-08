const express = require('express');
const dotenv = require('dotenv');
const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config();

/* Custom Module */
const routes = require('./src/route');
const connectDB = require('./src/database_config');

/* Initialize Routes & view Engine */
routes(app);

/* Database connection */
connectDB();


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
