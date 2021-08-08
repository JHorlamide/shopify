const mongoose = require('mongoose');
const debug = require('debug');
const config = require('config');

const db_url = config.get('MONGODB_URI');
const databaseConnectionMsg = debug('Database:connected...');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  databaseConnectionMsg('MongoDB connected...');
};

module.exports = connectDB;
