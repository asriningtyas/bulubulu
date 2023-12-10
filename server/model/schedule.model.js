// const { models: { Vet } } = require('../model/index');

module.exports = (sequelize, DataTypes) => {

    // define the table
    const Schedulled = sequelize.define('schedule',
        // define the column of the table
        {
            date: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            time: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            status: {
                type: DataTypes.STRING, // set column type
                allowNull: true // set column not null
            },
            isFinish: {
                type: DataTypes.BOOLEAN, // set column type
                defaultValue: false, // set column default value
                allowNull: false // set column not null
            },
            message: {
                type: DataTypes.TEXT, // set column type
                allowNull: true // set column not null
            },
            symptom: {
                type: DataTypes.TEXT, // set column type
                allowNull: true // set column not null
            },
        },
        // optional
        {
            freezeTableName: true,
        }
    );

    return Schedulled;

}