"use strict";
const { Model, UUIDV4 } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.belongsTo(models.Organization, {
                foreignKey: 'organizationId',
                onDelete: 'CASCADE'
            });
            User.hasMany(models.Reservation, {
                foreignKey: 'userId',
                as: 'reservations'
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
                        args: [/^\+?[1-9]\d{1,14}$/],
                        msg: "Please enter a valid phone number",
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
                type: DataTypes.ENUM('admin', 'employee', 'unassigned'),
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
