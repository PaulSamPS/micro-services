module.exports = {
  development: {
    username: process.env.DB_USER || 'review',
    password: process.env.DB_PASSWORD || 'review',
    database: process.env.DB_NAME || 'review',
    host: 'localhost',
    port: 5434,
    dialect: 'postgres',
  },
};
