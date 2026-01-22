const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database setup script for development
async function setupDatabase() {
  const sequelize = new Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'cardloom',
    username: process.env.DB_USER || 'cardloom_user',
    password: process.env.DB_PASSWORD || '',
    dialect: 'postgres',
    logging: console.log,
  });

  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    console.log('🔄 Creating tables...');
    await sequelize.sync({ force: true }); // Use force: true only in development
    console.log('✅ Database tables created successfully');

    console.log('🎉 Database setup complete!');
    console.log('📝 You can now run the API server with: npm run dev');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };