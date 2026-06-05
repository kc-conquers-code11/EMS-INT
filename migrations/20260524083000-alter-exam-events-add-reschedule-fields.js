'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exam_event', 'reschedule_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('exam_event', 'updated_dates', {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('exam_event', 'reschedule_reason');
    await queryInterface.removeColumn('exam_event', 'updated_dates');
  },
};
