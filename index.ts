import express, { Application, Request, Response } from "express";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import { typeDefs } from "./schema";
import resolvers from "./resolvers";
import sequelize from "./db";
import { JwtPayload, GraphQLContext } from "./index.type";
import { GraphQLError, GraphQLFormattedError } from "graphql";
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication helper
const getUser = (token: string): JwtPayload | null => {
    try {
        if (token) {
            const decoded = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.SECRET_KEY || 'RajeshYadav'
            ) as JwtPayload;
            return decoded;
        }
        return null;
    } catch (error) {
        return null;
    }
};

async function startServer() {
    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }): GraphQLContext => {
            const token = req.headers.authorization || '';
            const user = getUser(token);
            return { user };
        },
        formatError: (error: GraphQLError): GraphQLFormattedError => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                path: error.path || [],
                extensions: error.extensions
            };
        }
    });

    await server.start();

    server.applyMiddleware({
        app: app as any,
        path: '/graphql'
    });


    app.get("/", (req: Request, res: Response) => {
        res.send(`
      <h1>GraphQL API with TypeScript</h1>
      <p>Access GraphQL playground at <a href="/graphql">/graphql</a></p>
      <p>Database: ${process.env.DB_NAME}</p>
    `);
    });

    // Health check
    app.get("/health", (req: Request, res: Response) => {
        res.json({ status: "OK", timestamp: new Date().toISOString() });
    });

    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connected successfully');

        // Sync database (in development)
        if (process.env.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            console.log('Database synced');
        }


        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
            console.log(`GraphQL endpoint: http://localhost:${PORT}${server.graphqlPath}`);
        });
    } catch (error) {
        console.error('Unable to connect to database:', error);
        process.exit(1);
    }
}


process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

startServer();