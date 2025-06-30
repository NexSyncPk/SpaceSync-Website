"use strict";
const { Model, UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        static associate(models) {  
            Reservation.belongsTo(models.Room, {
                foreignKey: 'roomId',
                onDelete: 'CASCADE'
            });
            Reservation.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'SET NULL'
            });
            Reservation.hasMany(models.ExternalAttendee, {
                foreignKey: 'reservationId',
                as: 'externalAttendees'
            });
        }
    }

    Reservation.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: UUIDV4,
              },
            startTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            endTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            agenda: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
                allowNull: false,
                defaultValue: "pending",
            },            internalAttendees: {
                type: DataTypes.ARRAY(DataTypes.UUID),
                allowNull: true,
                defaultValue: [],
            },
        },
        {
            sequelize,
            modelName: "Reservation",
        }
    );

    return Reservation;
};
