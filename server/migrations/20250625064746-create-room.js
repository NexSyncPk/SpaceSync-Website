'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      displayProjector: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      displayWhiteboard: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      cateringAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      videoConferenceAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      organizationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes
    await queryInterface.addIndex('Rooms', ['organizationId']);
    await queryInterface.addIndex('Rooms', ['capacity']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};
