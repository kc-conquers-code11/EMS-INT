'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Disable checks to allow type changes on PKs/FKs
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Modify the primary key of academic_year
    await queryInterface.changeColumn('academic_year', 'academic_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Modify academic_id FK in semester table
    await queryInterface.changeColumn('semester', 'academic_id', {
      type: Sequelize.UUID,
      allowNull: false,
    });

    // Modify academic_id FK in exam_event table
    await queryInterface.changeColumn('exam_event', 'academic_id', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Re-enable checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down(queryInterface, Sequelize) {
    // Disable checks to revert type changes
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Revert academic_id FK in exam_event table
    await queryInterface.changeColumn('exam_event', 'academic_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Revert academic_id FK in semester table
    await queryInterface.changeColumn('semester', 'academic_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Revert the primary key of academic_year
    await queryInterface.changeColumn('academic_year', 'academic_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
    });

    // Re-enable checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },
};
