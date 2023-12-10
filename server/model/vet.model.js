module.exports = (sequelize, DataTypes) => {

    // define the table
    const Vet = sequelize.define('vet',
        // define the column of the table
        {
            experience: {
                type: DataTypes.INTEGER, // set column type
                allowNull: false // set column not null
            },
            operationHours: {
                type: DataTypes.STRING, // set column type
                allowNull: true // set column not null
            },
            operationDays: {
                type: DataTypes.STRING, // set column type
                allowNull: true // set column not null
            }
        },
        // optional
        {
            freezeTableName: true,
        }
    );

    return Vet;

}