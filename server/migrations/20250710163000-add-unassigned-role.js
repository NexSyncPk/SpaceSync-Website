'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, add the new enum value to the role column
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" ADD VALUE 'unassigned';
    `);

    // Update existing users who don't have an organization to have 'unassigned' role
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET role = 'unassigned' 
      WHERE "organizationId" IS NULL AND role = 'employee';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Update users back to 'employee' role
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET role = 'employee' 
      WHERE role = 'unassigned';
    `);

    // Note: PostgreSQL doesn't support removing enum values easily
    // In a production environment, you'd need to recreate the enum type
    // For now, we'll leave the enum value but it won't be used
  }
};
