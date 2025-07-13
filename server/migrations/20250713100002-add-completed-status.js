'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the new enum value 'completed' to the reservation status
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Reservations_status" ADD VALUE 'completed';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Note: PostgreSQL doesn't support removing enum values easily
    // In a production environment, you'd need to recreate the enum type
    // For now, we'll leave the enum value but update existing completed reservations
    await queryInterface.sequelize.query(`
      UPDATE "Reservations" 
      SET status = 'confirmed' 
      WHERE status = 'completed';
    `);
  }
};
