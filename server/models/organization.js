"use strict";
const { Model, UUIDV4 } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Organization extends Model {
        static associate(models) {
            Organization.hasMany(models.User, {
                foreignKey: 'organizationId',
                onDelete: 'CASCADE'
            });
            Organization.hasMany(models.Room, {
                foreignKey: 'organizationId',
                onDelete: 'CASCADE'
            });
        }
    }

    Organization.init(
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
            inviteKey: {
                type: DataTypes.STRING,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "Organization",
        }
    );

    return Organization;
};
