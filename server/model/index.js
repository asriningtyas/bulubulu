const dbConfig = require('../config/dbConfig');
const Sequelize = require('sequelize');

// set up the database connection
const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
});

const db = {};
// set sequelize connection
db.sequelize = sequelize;

// set the models
db.models = {};
db.models.Vet = require('./vet.model')(sequelize, Sequelize.DataTypes); // user model
db.models.User = require('./user.model')(sequelize, Sequelize.DataTypes); // user model
db.models.Schedulled = require('./schedule.model')(sequelize, Sequelize.DataTypes); // schedule model
db.models.Chat = require('./chat.model')(sequelize, Sequelize.DataTypes); // chat model

db.models.DataUser = db.models.Vet.belongsTo(db.models.User, { as: 'user' });
db.models.Schedulled.belongsTo(db.models.User, { as: 'user' });
db.models.Schedulled.belongsTo(db.models.Vet, { as: 'vet' });
db.models.Chat.belongsTo(db.models.User, { as: 'user' });
db.models.Chat.belongsTo(db.models.Vet, { as: 'vet' });

module.exports = db;