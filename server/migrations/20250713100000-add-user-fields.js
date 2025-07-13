'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new fields to Users table
    await queryInterface.addColumn('Users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: {
          args: [/^\+?[1-9]\d{1,14}$/],
          msg: "Please enter a valid phone number",
        },
      },
    });

    await queryInterface.addColumn('Users', 'department', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'position', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Modify organizationId to allow NULL values
    await queryInterface.changeColumn('Users', 'organizationId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Update the default value for role to 'unassigned'
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'employee', 'unassigned'),
      allowNull: false,
      defaultValue: 'unassigned'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the new columns
    await queryInterface.removeColumn('Users', 'phone');
    await queryInterface.removeColumn('Users', 'department');
    await queryInterface.removeColumn('Users', 'position');

    // Revert organizationId to not allow NULL (but first ensure all users have an organization)
    await queryInterface.sequelize.query(`
      UPDATE "Users" 
      SET "organizationId" = (SELECT id FROM "Organizations" LIMIT 1)
      WHERE "organizationId" IS NULL;
    `);

    await queryInterface.changeColumn('Users', 'organizationId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Organizations',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Revert default role to 'employee'
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.ENUM('admin', 'employee', 'unassigned'),
      allowNull: false,
      defaultValue: 'employee'
    });
  }
};
