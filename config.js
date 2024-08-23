import dotenv from 'dotenv';
dotenv.config();

const config = {
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/makemywedding',
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || 'jaibalayya',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
    SALT_ROUNDS: process.env.SALT_ROUNDS || 12,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME || "admin@gmail.com",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin@123",
    PRODUCTION: process.env.PRODUCTION || "false",
}
export default config;