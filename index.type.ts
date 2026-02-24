import { Model, Optional } from "sequelize";

export interface User {
    id: number;
    name?: string;
    username?: string;
    email: string;
    password: string;
    profile_picture?: string;
    forgotPasswordToken?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface LoginBody {
    username: string;
    password: string;
}

export interface UpdatePasswordParams {
    id: string;
}

export interface ResetPasswordBody {
    token: string;
    password: string;
}

export interface UpdatePassword {
    id: string;
    oldPassword: string;
    newPassword: string;
}

export interface LogoutParams {
    token: string;
}

export interface SearchUser {
    search: string;
}

export interface PaginationQuery {
    page?: string;
    limit?: string;
}

export interface UpdateUser {
    id: string;
    username: string;
    email: string;
    password: string;
    profile_picture: string;
}

export interface JwtPayload {
    id: number;
    email: string;
    username?: string;
    name?: string;
}

export interface UserAttributes {
    id: number;
    name?: string;
    email: string;
    username?: string;
    password: string;
    profile_picture?: string;
    forgotPasswordToken?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserCreationAttributes
    extends Optional<
        UserAttributes,
        "id" | "name" | "username" | "profile_picture" | "forgotPasswordToken" | "created_at" | "updated_at"
    > { }

// GraphQL Context Type
export interface GraphQLContext {
    user?: JwtPayload | null;
}

// Register Input Type
export interface RegisterInput {
    name?: string;
    email: string;
    username?: string;
    password: string;
}

// Login Input Type
export interface LoginInput {
    email: string;
    password: string;
}

// Update Profile Input Type
export interface UpdateProfileInput {
    name?: string;
    email?: string;
    username?: string;
}

// Change Password Input Type
export interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}

// Reset Password Input Type
export interface ResetPasswordInput {
    token: string;
    password: string;
}

// Auth Payload Type
export interface AuthPayload {
    token: string;
    user: UserAttributes;
}