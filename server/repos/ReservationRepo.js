const BaseRepo = require("./BaseRepo");
const { Reservation, User, Room, ExternalAttendee } = require("../models");
const { Op } = require("sequelize");

class ReservationRepo extends BaseRepo {
  constructor() {
    super(Reservation);
  }

  async getAllReservations(
    filters = {},
    pagination = {},
    organizationId = null
  ) {
    const where = { ...filters };

    const include = [
      {
        model: User,
        attributes: ["id", "name", "email", "phone", "department", "position"],
      },
      {
        model: Room,
        attributes: [
          "id",
          "name",
          "capacity",
          "displayProjector",
          "displayWhiteboard",
          "cateringAvailable",
          "videoConferenceAvailable",
        ],
        where: organizationId ? { organizationId } : undefined,
      },
      {
        model: User,
        as: "internalAttendees",
        through: { attributes: [] },
        attributes: ["id", "name", "email", "phone", "department", "position"],
      },
    ];

    if (pagination.limit) {
      return await this.model.findAndCountAll({
        where,
        include,
        limit: pagination.limit,
        offset: pagination.offset,
        order: [["startTime", "DESC"]],
      });
    }

    return await this.model.findAll({
      where,
      include,
      order: [["startTime", "DESC"]],
    });
  }

  async getReservationById(id, organizationId = null) {
    const include = [
      {
        model: User,
        attributes: ["id", "name", "email", "phone", "department", "position"],
      },
      {
        model: Room,
        attributes: [
          "id",
          "name",
          "capacity",
          "displayProjector",
          "displayWhiteboard",
          "cateringAvailable",
          "videoConferenceAvailable",
        ],
        where: organizationId ? { organizationId } : undefined,
      },
    ];

    return await this.model.findOne({
      where: { id },
      include,
    });
  }

  async getReservationsByStatus(status, organizationId = null) {
    const include = [
      {
        model: Room,
        where: organizationId ? { organizationId } : undefined,
      },
    ];

    return await this.model.findAll({
      where: { status },
      include,
    });
  }

  async getReservationsByUser(userId) {
    return await this.model.findAll({
      where: { userId },
      include: [
        {
          model: Room,
          attributes: [
            "id",
            "name",
            "capacity",
            "displayProjector",
            "displayWhiteboard",
            "cateringAvailable",
            "videoConferenceAvailable",
          ],
        },
        {
          model: ExternalAttendee,
          as: "externalAttendees",
          required: false,
        },
      ],
      order: [["startTime", "DESC"]],
    });
  }

  async getReservationsByRoom(roomId, dateRange = {}) {
    const where = { roomId };

    if (dateRange.startDate && dateRange.endDate) {
      where.startTime = {
        [Op.between]: [dateRange.startDate, dateRange.endDate],
      };
    }

    return await this.model.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "phone", "department"],
        },
      ],
      order: [["startTime", "ASC"]],
    });
  }

  async checkRoomAvailability(
    roomId,
    startTime,
    endTime,
    excludeReservationId = null
  ) {
    const where = {
      roomId,
      status: { [Op.ne]: "cancelled" },
      [Op.or]: [
        {
          startTime: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          endTime: {
            [Op.between]: [startTime, endTime],
          },
        },
        {
          [Op.and]: [
            { startTime: { [Op.lte]: startTime } },
            { endTime: { [Op.gte]: endTime } },
          ],
        },
      ],
    };

    if (excludeReservationId) {
      where.id = { [Op.ne]: excludeReservationId };
    }

    const conflictingReservations = await this.model.findAll({ where });
    return conflictingReservations.length === 0;
  }

  async updateReservationStatus(id, status) {
    return await this.model.update({ status }, { where: { id } });
  }

  async getUpcomingReservations(organizationId = null, limit = 10) {
    const include = [
      {
        model: Room,
        where: organizationId ? { organizationId } : undefined,
      },
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
    ];

    return await this.model.findAll({
      where: {
        startTime: { [Op.gt]: new Date() },
        status: { [Op.ne]: "cancelled" },
      },
      include,
      order: [["startTime", "ASC"]],
      limit,
    });
  }
}

module.exports = ReservationRepo;
