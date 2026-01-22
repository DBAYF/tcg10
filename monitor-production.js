#!/usr/bin/env node

/**
 * Cardloom TCG Platform - Production Monitoring Script
 *
 * This script continuously monitors the production deployment and alerts
 * if there are any issues with availability, performance, or errors.
 */

const https = require('https');
const http = require('http');

// Configuration - Update these after deployment
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://cardloom.vercel.app';
const BACKEND_URL = process.env.BACKEND_URL || 'https://cardloom-api.vercel.app';
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL) || 300000; // 5 minutes default
const ALERT_EMAIL = process.env.ALERT_EMAIL; // Optional: email for alerts

// Monitoring state
let consecutiveFailures = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
let lastStatus = {
  frontend: 'unknown',
  backend: 'unknown',
  timestamp: null
};

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
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
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

// HTTP request helper with timeout
function makeRequest(url, options = {}, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;

    const requestOptions = {
      headers: {
        'User-Agent': 'Cardloom-Monitor/1.0',
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
            data: jsonData,
            responseTime: Date.now() - startTime
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            responseTime: Date.now() - startTime
          });
        }
      });
    });

    const startTime = Date.now();

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(timeout, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
  });
}

// Health check functions
async function checkFrontend() {
  try {
    const response = await makeRequest(FRONTEND_URL, {}, 15000);

    if (response.status === 200) {
      if (lastStatus.frontend !== 'healthy') {
        logSuccess(`Frontend is healthy (Status: ${response.status}, Response: ${response.responseTime}ms)`);
        if (lastStatus.frontend === 'unhealthy') {
          logSuccess('🎉 Frontend recovered from previous issues!');
        }
      }
      return { status: 'healthy', responseTime: response.responseTime, statusCode: response.status };
    } else {
      logWarning(`Frontend returned status: ${response.status}`);
      return { status: 'warning', responseTime: response.responseTime, statusCode: response.status };
    }
  } catch (error) {
    logError(`Frontend check failed: ${error.message}`);
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkBackend() {
  try {
    const healthUrl = `${BACKEND_URL}/health`;
    const response = await makeRequest(healthUrl, {}, 10000);

    if (response.status === 200 && response.data?.status === 'OK') {
      if (lastStatus.backend !== 'healthy') {
        logSuccess(`Backend is healthy (Status: ${response.status}, Response: ${response.responseTime}ms)`);
        if (lastStatus.backend === 'unhealthy') {
          logSuccess('🎉 Backend recovered from previous issues!');
        }
      }
      return { status: 'healthy', responseTime: response.responseTime, statusCode: response.status };
    } else {
      logWarning(`Backend health check failed (Status: ${response.status})`);
      return { status: 'warning', responseTime: response.responseTime, statusCode: response.status };
    }
  } catch (error) {
    logError(`Backend check failed: ${error.message}`);
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkAPIEndpoints() {
  const endpoints = [
    { path: '/api/cards', name: 'Cards API' },
    { path: '/api/marketplace/listings', name: 'Marketplace API' }
  ];

  let allHealthy = true;

  for (const endpoint of endpoints) {
    try {
      const url = `${BACKEND_URL}${endpoint.path}`;
      const response = await makeRequest(url, {}, 8000);

      if (response.status !== 200) {
        logWarning(`${endpoint.name} returned status: ${response.status}`);
        allHealthy = false;
      }
    } catch (error) {
      logError(`${endpoint.name} check failed: ${error.message}`);
      allHealthy = false;
    }
  }

  return allHealthy;
}

// Alert function (can be extended to send emails/SMS)
function sendAlert(message, severity = 'warning') {
  consecutiveFailures++;

  logError(`🚨 ALERT: ${message}`);

  if (ALERT_EMAIL) {
    // TODO: Implement email sending
    logWarning(`Email alert would be sent to: ${ALERT_EMAIL}`);
  }

  // TODO: Integrate with monitoring services (DataDog, New Relic, etc.)

  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    logError(`🚨 CRITICAL: ${consecutiveFailures} consecutive failures detected!`);
    logError('Immediate attention required!');
  }
}

// Main monitoring loop
async function performHealthCheck() {
  const timestamp = new Date().toISOString();
  logInfo(`🔍 Starting health check cycle...`);

  try {
    // Check all services
    const [frontendResult, backendResult] = await Promise.all([
      checkFrontend(),
      checkBackend()
    ]);

    // Check API endpoints if backend is healthy
    let apiHealthy = false;
    if (backendResult.status === 'healthy') {
      apiHealthy = await checkAPIEndpoints();
    }

    // Update status
    const currentStatus = {
      frontend: frontendResult.status,
      backend: backendResult.status,
      api: apiHealthy ? 'healthy' : 'unhealthy',
      timestamp: timestamp
    };

    // Check for status changes and alerts
    if (lastStatus.frontend === 'healthy' && frontendResult.status === 'unhealthy') {
      sendAlert('Frontend is down!', 'critical');
    }

    if (lastStatus.backend === 'healthy' && backendResult.status === 'unhealthy') {
      sendAlert('Backend is down!', 'critical');
    }

    if (lastStatus.backend === 'healthy' && !apiHealthy) {
      sendAlert('API endpoints are not responding!', 'warning');
    }

    // Reset consecutive failures on successful checks
    if (frontendResult.status === 'healthy' && backendResult.status === 'healthy' && apiHealthy) {
      if (consecutiveFailures > 0) {
        logSuccess(`✅ All systems recovered after ${consecutiveFailures} failures`);
        consecutiveFailures = 0;
      }
    }

    // Update last status
    lastStatus = {
      frontend: frontendResult.status,
      backend: backendResult.status,
      timestamp: timestamp
    };

    // Performance logging
    if (frontendResult.responseTime && backendResult.responseTime) {
      logInfo(`Performance - Frontend: ${frontendResult.responseTime}ms, Backend: ${backendResult.responseTime}ms`);
    }

  } catch (error) {
    logError(`Health check cycle failed: ${error.message}`);
    sendAlert(`Health check system error: ${error.message}`, 'warning');
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  logInfo('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logInfo('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Main execution
async function startMonitoring() {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log('🚀 Cardloom TCG Platform - Production Monitor', 'bright');
  log(`${'='.repeat(60)}\n`, 'cyan');

  log(`📊 Monitoring Configuration:`, 'magenta');
  log(`   Frontend URL: ${FRONTEND_URL}`);
  log(`   Backend URL: ${BACKEND_URL}`);
  log(`   Check Interval: ${CHECK_INTERVAL / 1000} seconds`);
  log(`   Alert Email: ${ALERT_EMAIL || 'Not configured'}`);
  log(`   Started at: ${new Date().toISOString()}\n`);

  // Perform initial health check
  await performHealthCheck();

  // Set up recurring checks
  setInterval(async () => {
    await performHealthCheck();
  }, CHECK_INTERVAL);

  logSuccess(`🔄 Monitoring started! Checks will run every ${CHECK_INTERVAL / 1000} seconds`);
  logInfo('Press Ctrl+C to stop monitoring\n');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length >= 1) {
  // Allow overriding URLs and settings via command line
  if (args[0]) process.env.FRONTEND_URL = args[0];
  if (args[1]) process.env.BACKEND_URL = args[1];
  if (args[2]) process.env.CHECK_INTERVAL = args[2];
  if (args[3]) process.env.ALERT_EMAIL = args[3];
}

// Start monitoring
startMonitoring().catch((error) => {
  logError(`Failed to start monitoring: ${error.message}`);
  console.error(error);
  process.exit(1);
});