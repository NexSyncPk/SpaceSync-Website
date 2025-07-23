"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("ReservationAttendees", {
            reservationId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "Reservations",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            userId: {
                type: Sequelize.UUID,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("ReservationAttendees");
    },
};
