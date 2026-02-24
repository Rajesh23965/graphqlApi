import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import User from "../model";
import {
    JwtPayload,
    GraphQLContext,
    RegisterInput,
    LoginInput,
    UpdateProfileInput,
    ChangePasswordInput,
    ResetPasswordInput,
    AuthPayload
} from "../index.type";

const resolvers = {
    Query: {
        users: async (_: any, { page = 1, limit = 10 }: { page: number; limit: number }): Promise<User[]> => {
            const offset = (page - 1) * limit;
            return await User.findAll({
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
        },

        user: async (_: any, { id }: { id: string }): Promise<User | null> => {
            return await User.findByPk(id);
        },

        searchUsers: async (_: any, { search }: { search: string }): Promise<User[]> => {
            return await User.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { username: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } }
                    ]
                }
            });
        },

        me: async (_: any, __: any, context: GraphQLContext): Promise<User | null> => {
            if (!context.user) throw new Error("Not authenticated");
            return await User.findByPk(context.user.id);
        }
    },

    Mutation: {
        register: async (_: any, { input }: { input: RegisterInput }): Promise<AuthPayload> => {
            const { name, email, username, password } = input;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) throw new Error("User already exists");

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                name,
                email,
                username,
                password: hashedPassword
            });

            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username },
                process.env.SECRET_KEY || 'RajeshYadav',
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        login: async (_: any, { email, password }: LoginInput): Promise<AuthPayload> => {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error("User not found");

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) throw new Error("Invalid password");

            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username },
                process.env.SECRET_KEY || 'RajeshYadav',
                { expiresIn: '7d' }
            );

            return { token, user };
        },

        updateProfile: async (
            _: any,
            { input }: { input: UpdateProfileInput },
            context: GraphQLContext
        ): Promise<User> => {
            if (!context.user) throw new Error("Not authenticated");

            const user = await User.findByPk(context.user.id);
            if (!user) throw new Error("User not found");

            await user.update(input);
            return user;
        },

        changePassword: async (
            _: any,
            { input }: { input: ChangePasswordInput },
            context: GraphQLContext
        ): Promise<boolean> => {
            if (!context.user) throw new Error("Not authenticated");

            const user = await User.findByPk(context.user.id);
            if (!user) throw new Error("User not found");

            const validPassword = await bcrypt.compare(input.oldPassword, user.password);
            if (!validPassword) throw new Error("Invalid old password");

            const hashedPassword = await bcrypt.hash(input.newPassword, 10);
            await user.update({ password: hashedPassword });

            return true;
        },

        logout: (): boolean => {
            // Client-side: remove token
            return true;
        },

        forgotPassword: async (_: any, { email }: { email: string }): Promise<boolean> => {
            const user = await User.findOne({ where: { email } });
            if (!user) throw new Error("User not found");

            // Generate reset token
            const resetToken = jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET_KEY || 'RajeshYadav',
                { expiresIn: '1h' }
            );

            // Save token to user (in production, you'd send this via email)
            await user.update({ forgotPasswordToken: resetToken });

            // In production, send email here
            console.log(`Reset token for ${email}: ${resetToken}`);

            return true;
        },

        resetPassword: async (_: any, { input }: { input: ResetPasswordInput }): Promise<boolean> => {
            const { token, password } = input;

            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY || 'RajeshYadav') as JwtPayload;

                const user = await User.findOne({
                    where: {
                        id: decoded.id,
                        forgotPasswordToken: token
                    }
                });

                if (!user) throw new Error("Invalid or expired token");

                const hashedPassword = await bcrypt.hash(password, 10);
                await user.update({
                    password: hashedPassword,
                    forgotPasswordToken: null
                });

                return true;
            } catch (error) {
                throw new Error("Invalid or expired token");
            }
        }
    }
};

export default resolvers;