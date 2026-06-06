const db = require('../models');
const { Sequelize } = require('sequelize');

async function migrate() {
    const queryInterface = db.sequelize.getQueryInterface();
    try {
        await queryInterface.dropTable('reassessment_request');
        await queryInterface.dropTable('photocopy_request');

        await queryInterface.createTable('reassessment_request', {
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
            subject_mapping_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            component: {
                type: Sequelize.STRING,
                allowNull: false
            },
            fee_status: {
                type: Sequelize.ENUM('PENDING', 'PAID'),
                defaultValue: 'PENDING'
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'APPLIED'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.createTable('photocopy_request', {
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
            subject_mapping_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            component: {
                type: Sequelize.STRING,
                allowNull: false
            },
            fee_status: {
                type: Sequelize.ENUM('PENDING', 'PAID'),
                defaultValue: 'PENDING'
            },
            status: {
                type: Sequelize.STRING,
                defaultValue: 'APPLIED'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        console.log("Post-exam request tables migrated successfully!");
    } catch (e) {
        console.error("Migration failed: ", e);
    } finally {
        process.exit(0);
    }
}
migrate();
