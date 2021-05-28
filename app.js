const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

/* Custom Module */
const routes = require('./src/route');
const connectDB = require('./src/database_config');
const User = require('./models/mongodb models/User');

/* Initialize Routes & view Engine */
routes(app);

/* Database connection */
connectDB();

const createUser = async () => {
  const user = new User({
    name: 'JHorlamide',
    email: 'olamide_jubril@outlook.com',
    cart: { items: [] },
  });

  await user.save()
};

// createUser()

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});
