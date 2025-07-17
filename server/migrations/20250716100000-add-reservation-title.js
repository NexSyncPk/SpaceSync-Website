'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Reservations', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Meeting', // Temporary default for existing records
    });
    
    // Remove the default value constraint after adding the column
    await queryInterface.changeColumn('Reservations', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Reservations', 'title');
  }
};
