'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true
                }
            },
            username: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
            },
            profile_picture: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: ""
            },
            forgot_password_token: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });

        // Add indexes
        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['username']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};