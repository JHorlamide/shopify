const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

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
