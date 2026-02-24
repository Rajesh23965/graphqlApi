# GraphQL API with TypeScript and Sequelize

A production-ready GraphQL API built with TypeScript, Express, Apollo Server, and Sequelize ORM with MySQL database.

## 📋 Features

- **GraphQL API** with Apollo Server Express
- **TypeScript** for type safety
- **Sequelize ORM** with MySQL database
- **JWT Authentication** with bcrypt password hashing
- **Database Migrations** using Sequelize CLI
- **File Upload** support with Multer
- **User Management** (Register, Login, Profile Update)
- **Password Reset** functionality
- **Search & Pagination** support

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **GraphQL**: Apollo Server Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer

## 📁 Project Structure

```
graphQLAPI/
├── config/
│   └── config.json          # Sequelize configuration
├── migrations/
│   └── 20231215000000-create-users-table.js
├── resolvers/
│   └── index.ts             # GraphQL resolvers
├── schema/
│   └── index.ts             # GraphQL type definitions
├── utils/
│   └── upload.ts            # Multer upload configuration
├── .env                      # Environment variables
├── .sequelizerc             # Sequelize CLI configuration
├── db.ts                     # Database connection
├── index.ts                  # Main application entry
├── index.type.ts             # TypeScript interfaces
├── model.ts                  # Sequelize User model
├── multer.ts                 # Multer configuration
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd graphQLAPI
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3002
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=NewPassword
   DB_NAME=graphqlapi
   DB_PORT=3306
   SECRET_KEY=RajeshYadav
   ```

4. **Create database**
   ```
   npx sequelize-cli db:create
   ```

5. **Run migrations**
   ```
   npm run migrate
   ```

6. **Start the development server**
   ```
   npm run dev
   ```

7. **Access GraphQL Playground**
   
   Open your browser and navigate to:
   ```
   http://localhost:3002/graphql
   ```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Run production build |
| `npm run migrate` | Run database migrations |
| `npm run migrate:undo` | Undo last migration |
| `npm run type-check` | Check TypeScript types |

## 🔧 Configuration Files

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Sequelize Configuration (config/config.json)
```json
{
  "development": {
    "username": "root",
    "password": "NewPassword",
    "database": "graphqlapi",
    "host": "localhost",
    "dialect": "mysql"
  }
}
```

## 📊 GraphQL API Documentation

### Types

```graphql
type User {
  id: ID!
  name: String
  email: String!
  username: String
  profile_picture: String
  created_at: String
  updated_at: String
}

type AuthPayload {
  token: String!
  user: User!
}
```

### Queries

| Query | Description | Authentication |
|-------|-------------|----------------|
| `users(page: Int, limit: Int): [User!]!` | Get all users with pagination | No |
| `user(id: ID!): User` | Get user by ID | No |
| `searchUsers(search: String!): [User!]!` | Search users by name/email/username | No |
| `me: User` | Get current authenticated user | Yes |

### Mutations

| Mutation | Description | Authentication |
|----------|-------------|----------------|
| `register(input: RegisterInput!): AuthPayload!` | Register new user | No |
| `login(email: String!, password: String!): AuthPayload!` | Login user | No |
| `updateProfile(input: UpdateProfileInput!): User!` | Update user profile | Yes |
| `changePassword(input: ChangePasswordInput!): Boolean!` | Change password | Yes |
| `forgotPassword(email: String!): Boolean!` | Request password reset | No |
| `resetPassword(input: ResetPasswordInput!): Boolean!` | Reset password with token | No |
| `logout: Boolean!` | Logout user | Yes |

### Input Types

```graphql
input RegisterInput {
  name: String
  email: String!
  username: String
  password: String!
}

input UpdateProfileInput {
  name: String
  email: String
  username: String
}

input ChangePasswordInput {
  oldPassword: String!
  newPassword: String!
}

input ResetPasswordInput {
  token: String!
  password: String!
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example Login Response
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "username": "johndoe"
      }
    }
  }
}
```

## 📝 Example Queries

### Register User
```graphql
mutation {
  register(input: {
    name: "John Doe"
    email: "john@example.com"
    username: "johndoe"
    password: "password123"
  }) {
    token
    user {
      id
      name
      email
      username
    }
  }
}
```

### Login
```graphql
mutation {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      id
      name
      email
    }
  }
}
```

### Get All Users (with pagination)
```graphql
query {
  users(page: 1, limit: 10) {
    id
    name
    email
    username
    profile_picture
  }
}
```

### Search Users
```graphql
query {
  searchUsers(search: "john") {
    id
    name
    email
    username
  }
}
```

### Get Current User (Authenticated)
```graphql
query {
  me {
    id
    name
    email
    username
    created_at
  }
}
```

### Update Profile (Authenticated)
```graphql
mutation {
  updateProfile(input: {
    name: "John Updated"
    username: "john_updated"
  }) {
    id
    name
    username
    email
  }
}
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(255) UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255) DEFAULT '',
  forgot_password_token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚦 Error Handling

The API returns formatted GraphQL errors:

```json
{
  "errors": [
    {
      "message": "User not found",
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND"
      }
    }
  ]
}
```

## 📦 Dependencies

### Production Dependencies
- apollo-server-express
- bcryptjs
- dotenv
- express
- graphql
- jsonwebtoken
- multer
- mysql2
- sequelize
- sequelize-cli

### Development Dependencies
- @types/bcryptjs
- @types/express
- @types/jsonwebtoken
- @types/multer
- @types/node
- nodemon
- ts-node
- typescript

## 🧪 Testing

You can test the API using:
- GraphQL Playground (http://localhost:3002/graphql)
- Postman
- Insomnia
- Curl commands

Example curl request:
```
curl -X POST http://localhost:3002/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { users { id name email } }"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Rajesh Yadav

## 🙏 Acknowledgments

- Apollo GraphQL
- Sequelize Team
- Express.js Community

## 📧 Contact

For any questions or support, please open an issue in the repository.

---

**Happy Coding!** 🚀
