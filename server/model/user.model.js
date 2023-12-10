// const { models: { Vet } } = require('../model/index');

module.exports = (sequelize, DataTypes) => {

    // define the table
    const User = sequelize.define('user',
        // define the column of the table
        {
            username: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            password: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            fullName: {
                type: DataTypes.STRING, // set column type
                allowNull: true // set column not null
            },
            email: {
                type: DataTypes.STRING, // set column type
                allowNull: true // set column not null
            },
            image: {
                type: DataTypes.TEXT, // set column type
                allowNull: true // set column not null
            },
            role: {
                type: DataTypes.STRING, // set column type
                allowNull: false, // set column not null
                defaultValue: 'user', // set column default value
            },
            isLogin: {
                type: DataTypes.BOOLEAN, // set column type
                allowNull: false, // set column not null
                defaultValue: false, // set column default value
            },
        },
        // optional
        {
            freezeTableName: true,
        }
    );

    return User;

}