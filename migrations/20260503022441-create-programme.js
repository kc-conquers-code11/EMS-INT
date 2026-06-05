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
    await queryInterface.createTable('programme', {
      programm_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      institution_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'institution',
          key: 'institution_id'
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
      programme_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      programme_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      degree_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      duration_years: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      total_semesters: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('programme');
  }
};
