'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('branch', {
      branch_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      programm_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'programme',
          key: 'programm_id'
        }
      },
      depart_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'department',
          key: 'depart_id'
        }
      },
      branch_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      branch_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      total_intake: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      accreditation_status: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('branch');
  }
};
