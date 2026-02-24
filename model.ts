import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./db";
import { UserAttributes, UserCreationAttributes } from "./index.type";

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public username!: string;
    public password!: string;
    public profile_picture!: string;
    public forgotPasswordToken!: string;

    // Timestamps
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profile_picture: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: ""
        },
        forgotPasswordToken: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'forgot_password_token'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'Users',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default User;