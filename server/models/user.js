"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Organization, {
                foreignKey: "organizationId",
                onDelete: "CASCADE",
            });
            User.hasMany(models.Reservation, {
                foreignKey: "userId",
                as: "reservations",
            });
            User.belongsToMany(models.Reservation, {
                through: "ReservationAttendees",
                as: "attendingReservations",
                foreignKey: "userId",
            });
        }
    }
    User.init(
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
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: "Please enter a valid email address",
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 100],
                        msg: "Password must be between 6 and 100 characters long",
                    },
                },
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    is: {
                        args: [/^(03|021)\d{9}$/],
                        msg: "Phone number must start with 03 or 021 and be 11 digits long",
                    },
                    len: {
                        args: [11, 11],
                        msg: "Phone number must be exactly 11 digits",
                    },
                },
            },
            department: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            role: {
                type: DataTypes.ENUM("admin", "employee", "unassigned"),
                allowNull: false,
                defaultValue: "unassigned",
            },
        },
        {
            sequelize,
            modelName: "User",
        }
    );
    return User;
};
