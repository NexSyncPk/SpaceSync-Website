'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservations', 'internalAttendees');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservations', 'internalAttendees', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      allowNull: true,
      defaultValue: [],
    });
  }
};
