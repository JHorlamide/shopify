const mongoose = require('mongoose');
const debug = require('debug');
// const config = require('config');

const databaseConnectionMsg = debug('Database:connected...');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  databaseConnectionMsg('MongoDB connected...');
};

module.exports = connectDB;
