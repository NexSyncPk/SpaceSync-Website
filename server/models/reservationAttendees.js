"use strict";
module.exports = (sequelize, DataTypes) => {
    const ReservationAttendees = sequelize.define("ReservationAttendees", {
        reservationId: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
    }, {
        timestamps: false,
    });

    return ReservationAttendees;
};
