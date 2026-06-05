'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
    // Disable checks to allow type changes on PKs/FKs
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Drop foreign key constraint
    await queryInterface.removeConstraint('department', 'fk_department_institution');

    // 1. Modify Parent: Institution ID Only
    await queryInterface.changeColumn('institution', 'institution_id', {
      type: Sequelize.UUID,
      allowNull: false
    });
    // 2. Modify the Child FK (Department's reference to Institution)
    await queryInterface.changeColumn('department', 'institution_id', {
      type: Sequelize.UUID,
      allowNull: true
    });

    // 3. Modify the Department PK
    await queryInterface.changeColumn('department', 'depart_id', {
      type: Sequelize.UUID,
      allowNull: false
    });

    // 4. Re-add the Foreign Key constraint now that both are UUIDs
    await queryInterface.addConstraint('department', {
      fields: ['institution_id'],
      type: 'foreign key',
      name: 'fk_department_institution',
      references: {
        table: 'institution',
        field: 'institution_id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    // 5. Re-enable checks
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('programme', 'institution_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.changeColumn('programme', 'depart_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
