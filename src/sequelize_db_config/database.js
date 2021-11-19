const Sequelize = require("sequelize");
const debug = require("debug");

const dbConnectionTest = debug("Database:connected");

const sequelize = new Sequelize("node-complete", "root", "", {
  dialect: "mysql",
  host: "localhost",
});

try {
  sequelize.authenticate();
  dbConnectionTest("Database connected successfully");
} catch (error) {
  console.log("Unable to connect to database: " + error.message);
}

module.exports = sequelize;

// const Sequel = async () => {
//   try {
//     await sequelize.sync();

//     const user = await User.findByPk(1);

//     if (!user) {
//       return User.create({
//         name: 'Olamide Jubril',
//         email: 'olamide_jubril@outlook.com',
//       });
//     }

//     return user;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// sequelize
//   // .sync({ force: true })
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//   })
//   .then((user) => {
//     if (!user) {
//       return User.create({
//         name: 'Olamide Jubril',
//         email: 'olamide_jubril@outlook.com',
//       });
//     }
//     return user;
//   })
//   .then((user) => {
//     return user.createCart();
//   })
//   .then((cart) => {
//     app.listen(PORT, () => {
//       console.log(`Server started on ${PORT}...`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });
