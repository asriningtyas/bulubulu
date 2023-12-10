module.exports = (sequelize, DataTypes) => {

    // define the table
    const User = sequelize.define('chat',
        // define the column of the table
        {
            roomId: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            message: {
                type: DataTypes.TEXT, // set column type
                allowNull: false // set column not null
            },
            from: {
                type: DataTypes.STRING, // set column type
                allowNull: false // set column not null
            },
            date: {
                type: DataTypes.TEXT, // set column type
                allowNull: false // set column not null
            },
        },
        // optional
        {
            freezeTableName: true,
        }
    );

    return User;

}