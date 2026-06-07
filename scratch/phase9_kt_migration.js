const db = require('../models');
const { Sequelize } = require('sequelize');

async function migrate() {
    const queryInterface = db.sequelize.getQueryInterface();
    try {
        await queryInterface.dropTable('kt_registration');
        await queryInterface.dropTable('kt_eligibility');
        await queryInterface.dropTable('year_drop_log');

        await queryInterface.createTable('kt_eligibility', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            student_prn: {
                type: Sequelize.STRING,
                allowNull: false
            },
            original_exam_event_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            subject_mapping_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            failed_component: {
                type: Sequelize.ENUM('THEORY', 'PRACTICAL', 'IA'),
                allowNull: false
            },
            attempt_count: {
                type: Sequelize.INTEGER,
                defaultValue: 1
            },
            status: {
                type: Sequelize.ENUM('PENDING_REG', 'REGISTERED', 'CLEARED', 'EXHAUSTED'),
                defaultValue: 'PENDING_REG'
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        await queryInterface.createTable('kt_registration', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            kt_eligibility_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            kt_exam_event_id: {
                type: Sequelize.UUID,
                allowNull: false
            },
            fee_status: {
                type: Sequelize.ENUM('PENDING', 'PAID'),
                defaultValue: 'PENDING'
            },
            registration_status: {
                type: Sequelize.ENUM('PENDING', 'CONFIRMED'),
                defaultValue: 'PENDING'
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        await queryInterface.createTable('year_drop_log', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            student_prn: {
                type: Sequelize.STRING,
                allowNull: false
            },
            academic_year: {
                type: Sequelize.STRING,
                allowNull: false
            },
            total_active_kts: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'LIFTED'),
                defaultValue: 'ACTIVE'
            },
            createdAt: { allowNull: false, type: Sequelize.DATE },
            updatedAt: { allowNull: false, type: Sequelize.DATE }
        });

        console.log("KT Phase 9 tables migrated successfully!");
    } catch (e) {
        console.error("Migration failed: ", e);
    } finally {
        process.exit(0);
    }
}
migrate();
