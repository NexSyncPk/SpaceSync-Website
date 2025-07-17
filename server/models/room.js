"use strict";
const { Model, UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Room extends Model {
        static associate(models) {
            Room.belongsTo(models.Organization, {
                foreignKey: 'organizationId',
                onDelete: 'CASCADE'
            });
            Room.hasMany(models.Reservation, {
                foreignKey: 'roomId',
                as: 'reservations'
            });
        }
    }

    Room.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            displayProjector: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            displayWhiteboard: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            cateringAvailable: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            videoConferenceAvailable: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
            // organizationId: {
            //     type: DataTypes.UUID,
            //     allowNull: false,
            //     references: {
            //         model: 'Organizations',
            //         key: 'id'
            //     }
            // },
        },
        {
            sequelize,
            modelName: "Room",
        }
    );

    return Room;
};
