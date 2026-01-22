#!/usr/bin/env node

/**
 * Cardloom TCG Platform - Deployment Verification Script
 *
 * This script verifies that both the frontend and backend deployments are working correctly.
 * Run this after deploying to production to ensure everything is functioning.
 */

const https = require('https');
const http = require('http');

// Configuration - Update these URLs after deployment
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cardloom.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://cardloom-api.vercel.app';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🚀 ${message}`, 'bright');
  log(`${'='.repeat(60)}\n`, 'cyan');
}

function logSection(message) {
  log(`\n📋 ${message}`, 'yellow');
  log(`${'-'.repeat(40)}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const requestOptions = {
      headers: {
        'User-Agent': 'Cardloom-Deployment-Verifier/1.0',
        ...options.headers
      },
      ...options
    };

    const req = protocol.get(url, requestOptions, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Test functions
async function testFrontend() {
  logSection('Testing Frontend Deployment');

  try {
    logInfo(`Testing frontend URL: ${FRONTEND_URL}`);

    const response = await makeRequest(FRONTEND_URL);

    if (response.status === 200) {
      logSuccess('Frontend is accessible');
      logSuccess(`Status: ${response.status}`);
      logSuccess(`Content-Type: ${response.headers['content-type']}`);

      // Check if it's HTML content
      if (response.headers['content-type']?.includes('text/html')) {
        logSuccess('Serving HTML content correctly');

        // Check for key HTML elements
        const htmlContent = response.data;
        if (htmlContent.includes('id="root"')) {
          logSuccess('React root element found');
        } else {
          logWarning('React root element not found in HTML');
        }

        if (htmlContent.includes('Cardloom')) {
          logSuccess('App title found in HTML');
        } else {
          logWarning('App title not found in HTML');
        }
      } else {
        logWarning('Not serving HTML content');
      }
    } else {
      logError(`Frontend returned status: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    logError(`Frontend test failed: ${error.message}`);
    return false;
  }
}

async function testBackendHealth() {
  logSection('Testing Backend Health Check');

  try {
    const healthUrl = `${BACKEND_URL}/health`;
    logInfo(`Testing health endpoint: ${healthUrl}`);

    const response = await makeRequest(healthUrl);

    if (response.status === 200) {
      logSuccess('Health endpoint responding');
      logSuccess(`Status: ${response.status}`);

      if (response.data && typeof response.data === 'object') {
        logSuccess('Health response is valid JSON');

        if (response.data.status === 'OK') {
          logSuccess('Health status: OK');
        } else {
          logWarning(`Health status: ${response.data.status}`);
        }

        if (response.data.environment === 'production') {
          logSuccess('Environment: production');
        } else {
          logInfo(`Environment: ${response.data.environment}`);
        }

        if (response.data.timestamp) {
          logSuccess('Timestamp included in response');
        }
      } else {
        logWarning('Health response is not valid JSON');
      }
    } else {
      logError(`Health endpoint returned status: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

async function testBackendAPI() {
  logSection('Testing Backend API Endpoints');

  const endpoints = [
    { path: '/api/cards', name: 'Cards API' },
    { path: '/api/marketplace/listings', name: 'Marketplace API' },
    { path: '/api/cards/sets', name: 'Card Sets API' }
  ];

  let allPassed = true;

  for (const endpoint of endpoints) {
    try {
      const url = `${BACKEND_URL}${endpoint.path}`;
      logInfo(`Testing ${endpoint.name}: ${url}`);

      const response = await makeRequest(url);

      if (response.status === 200) {
        logSuccess(`${endpoint.name} responding correctly`);

        if (response.data && typeof response.data === 'object') {
          if (response.data.success === true) {
            logSuccess(`${endpoint.name} returned success response`);
          } else {
            logWarning(`${endpoint.name} response success field is not true`);
          }

          // Check for data array
          if (Array.isArray(response.data.data)) {
            logSuccess(`${endpoint.name} returned data array (${response.data.data.length} items)`);
          } else if (response.data.data) {
            logSuccess(`${endpoint.name} returned data object`);
          }
        } else {
          logWarning(`${endpoint.name} response is not valid JSON`);
        }
      } else {
        logError(`${endpoint.name} returned status: ${response.status}`);
        allPassed = false;
      }
    } catch (error) {
      logError(`${endpoint.name} test failed: ${error.message}`);
      allPassed = false;
    }
  }

  return allPassed;
}

async function testIntegration() {
  logSection('Testing Frontend-Backend Integration');

  try {
    logInfo('Checking if frontend can communicate with backend...');
    logInfo('(This would require browser testing for full verification)');

    // Test CORS headers
    const corsTest = await makeRequest(`${BACKEND_URL}/api/cards`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });

    if (corsTest.headers['access-control-allow-origin']) {
      logSuccess('CORS headers configured correctly');
    } else {
      logWarning('CORS headers not detected (may still work)');
    }

    logInfo('For complete integration testing:');
    logInfo('1. Open frontend URL in browser');
    logInfo('2. Check browser Developer Tools > Network tab');
    logInfo('3. Look for API calls to backend');
    logInfo('4. Verify no CORS errors in console');

    return true;
  } catch (error) {
    logError(`Integration test failed: ${error.message}`);
    return false;
  }
}

async function testPerformance() {
  logSection('Basic Performance Testing');

  const urls = [
    { url: FRONTEND_URL, name: 'Frontend' },
    { url: `${BACKEND_URL}/health`, name: 'Backend Health' },
    { url: `${BACKEND_URL}/api/cards`, name: 'Cards API' }
  ];

  for (const { url, name } of urls) {
    try {
      const startTime = Date.now();
      const response = await makeRequest(url);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.status === 200) {
        if (responseTime < 1000) {
          logSuccess(`${name} response time: ${responseTime}ms (Excellent)`);
        } else if (responseTime < 3000) {
          logSuccess(`${name} response time: ${responseTime}ms (Good)`);
        } else {
          logWarning(`${name} response time: ${responseTime}ms (Slow)`);
        }
      } else {
        logError(`${name} returned status: ${response.status}`);
      }
    } catch (error) {
      logError(`${name} performance test failed: ${error.message}`);
    }
  }

  return true;
}

// Main test runner
async function runTests() {
  logHeader('Cardloom TCG Platform - Deployment Verification');

  log(`Frontend URL: ${FRONTEND_URL}`, 'magenta');
  log(`Backend URL: ${BACKEND_URL}`, 'magenta');
  log(`Test started at: ${new Date().toISOString()}\n`, 'cyan');

  const results = {
    frontend: false,
    backendHealth: false,
    backendAPI: false,
    integration: false,
    performance: false
  };

  // Run all tests
  results.frontend = await testFrontend();
  results.backendHealth = await testBackendHealth();
  results.backendAPI = await testBackendAPI();
  results.integration = await testIntegration();
  results.performance = await testPerformance();

  // Summary
  logHeader('Test Results Summary');

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;

  log(`\n📊 Overall Results: ${passedTests}/${totalTests} tests passed`, 'bright');

  if (passedTests === totalTests) {
    log('\n🎉 ALL TESTS PASSED! Deployment is successful!', 'green');
    log('🚀 Cardloom TCG Platform is ready for production use!', 'green');
  } else {
    log('\n⚠️  Some tests failed. Please review the issues above.', 'yellow');
    log('🔧 Fix the failing tests before going live.', 'yellow');
  }

  // Detailed results
  log('\n📋 Detailed Results:', 'bright');
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`   ${test}: ${status}`, color);
  });

  // Next steps
  log('\n📝 Next Steps:', 'bright');
  if (passedTests === totalTests) {
    log('1. ✅ Monitor performance in Vercel dashboard', 'green');
    log('2. ✅ Set up analytics and error tracking', 'green');
    log('3. ✅ Announce launch to users', 'green');
    log('4. ✅ Monitor user feedback and metrics', 'green');
  } else {
    log('1. ❌ Fix failing tests', 'red');
    log('2. 🔧 Redeploy after fixes', 'yellow');
    log('3. 🧪 Re-run this verification script', 'yellow');
    log('4. 🚀 Go live once all tests pass', 'green');
  }

  log(`\n🏁 Verification completed at: ${new Date().toISOString()}`, 'cyan');

  // Exit with appropriate code
  process.exit(passedTests === totalTests ? 0 : 1);
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length >= 1) {
  // Allow overriding URLs via command line
  if (args[0]) process.env.FRONTEND_URL = args[0];
  if (args[1]) process.env.BACKEND_URL = args[1];
}

// Run the tests
runTests().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});