'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add description field to Organizations table
    await queryInterface.addColumn('Organizations', 'description', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove description field
    await queryInterface.removeColumn('Organizations', 'description');
  }
};
