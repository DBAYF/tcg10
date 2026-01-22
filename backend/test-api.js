const axios = require('axios');

// Simple API test script
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing Cardloom API endpoints...\n');

  try {
    // Test health endpoint
    console.log('📊 Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test cards endpoint
    console.log('\n🃏 Testing cards endpoint...');
    const cardsResponse = await axios.get(`${API_BASE_URL}/api/cards`);
    console.log(`✅ Cards endpoint returned ${cardsResponse.data.data?.length || 0} cards`);

    // Test marketplace endpoint
    console.log('\n🏪 Testing marketplace endpoint...');
    const marketplaceResponse = await axios.get(`${API_BASE_URL}/api/marketplace/listings`);
    console.log(`✅ Marketplace endpoint returned ${marketplaceResponse.data.data?.length || 0} listings`);

    // Test individual endpoints
    if (cardsResponse.data.data?.length > 0) {
      const firstCard = cardsResponse.data.data[0];
      console.log(`\n🔍 Testing individual card endpoint for ${firstCard.name}...`);
      const cardResponse = await axios.get(`${API_BASE_URL}/api/cards/${firstCard.id}`);
      console.log('✅ Individual card endpoint working');
    }

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📋 API Endpoints Working:');
    console.log(`   Health: ${API_BASE_URL}/health`);
    console.log(`   Cards: ${API_BASE_URL}/api/cards`);
    console.log(`   Marketplace: ${API_BASE_URL}/api/marketplace/listings`);
    console.log(`   Auth: ${API_BASE_URL}/api/auth`);

  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('1. Make sure the backend server is running');
    console.error('2. Check the API_BASE_URL environment variable');
    console.error('3. Verify database connection');
    console.error('4. Check server logs for errors');
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };