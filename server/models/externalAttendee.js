const { Model, UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ExternalAttendee extends Model {
        static associate(models) {
            ExternalAttendee.belongsTo(models.Reservation, {
                foreignKey: 'reservationId',
                onDelete: 'CASCADE'
            });
        }
    }

    ExternalAttendee.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                validate: { isEmail: true },
            },
            phone: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: "ExternalAttendee",
        }
    );

    return ExternalAttendee;
};
