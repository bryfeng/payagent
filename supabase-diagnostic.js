// Supabase diagnostic script
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const http = require('http');
const https = require('https');

// Supabase configuration
const supabaseUrl = 'https://kjcvqvwocgabjyiknzbh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

// Report object
const report = {
  timestamp: new Date().toISOString(),
  environment: {
    nodeVersion: process.version,
    platform: process.platform,
    supabaseUrl,
    supabaseKeyAvailable: !!supabaseKey,
    supabaseKeyLength: supabaseKey ? supabaseKey.length : 0
  },
  connectivity: {
    supabaseReachable: false,
    message: ''
  },
  diagnostics: []
};

// Add diagnostic message
function addDiagnostic(message, isError = false) {
  console.log(isError ? `❌ ${message}` : `ℹ️ ${message}`);
  report.diagnostics.push({
    timestamp: new Date().toISOString(),
    message,
    isError
  });
}

// Test URL connectivity
function testUrlConnectivity(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, (res) => {
      resolve({
        success: res.statusCode >= 200 && res.statusCode < 300,
        statusCode: res.statusCode,
        message: `Status code: ${res.statusCode}`
      });
      res.resume(); // Consume response data to free up memory
    });
    
    req.on('error', (error) => {
      resolve({
        success: false,
        statusCode: null,
        message: `Connection error: ${error.message}`
      });
    });
    
    req.setTimeout(5000, () => {
      req.abort();
      resolve({
        success: false,
        statusCode: null,
        message: 'Connection timeout (5s)'
      });
    });
  });
}

// Generate markdown report
function generateMarkdownReport() {
  let md = `# Supabase Diagnostic Report
Generated: ${new Date(report.timestamp).toLocaleString()}

## Environment
- Node.js Version: ${report.environment.nodeVersion}
- Platform: ${report.environment.platform}
- Supabase URL: ${report.environment.supabaseUrl}
- Supabase Key Available: ${report.environment.supabaseKeyAvailable ? 'Yes' : 'No'}
- Supabase Key Length: ${report.environment.supabaseKeyLength} characters

## Connectivity Test
Status: ${report.connectivity.supabaseReachable ? '✅ PASSED' : '❌ FAILED'}
Message: ${report.connectivity.message}

## Diagnostic Log
`;

  report.diagnostics.forEach(entry => {
    md += `- ${new Date(entry.timestamp).toLocaleTimeString()}: ${entry.isError ? '❌' : 'ℹ️'} ${entry.message}\n`;
  });
  
  md += `
## Recommendations
`;

  // Add recommendations based on findings
  if (!report.environment.supabaseKeyAvailable) {
    md += `- Set up the Supabase key in your environment variables (NEXT_PUBLIC_SUPABASE_KEY or SUPABASE_KEY)\n`;
  } else if (report.environment.supabaseKeyLength < 20) {
    md += `- Your Supabase key appears to be too short. Check if it's the correct key\n`;
  }
  
  if (!report.connectivity.supabaseReachable) {
    md += `- Check your network connectivity to Supabase\n`;
    md += `- Verify that the Supabase URL is correct\n`;
    md += `- Ensure your firewall or network settings allow connections to Supabase\n`;
  }
  
  return md;
}

async function runDiagnostics() {
  console.log('=== SUPABASE DIAGNOSTIC TEST ===');
  console.log('Starting diagnostics at:', new Date().toISOString());
  console.log('-------------------------------');
  
  // Check environment
  if (!supabaseKey) {
    addDiagnostic('Supabase key is missing. Check your environment variables.', true);
  } else {
    addDiagnostic(`Supabase key is available (${supabaseKey.length} characters)`);
  }
  
  // Test basic connectivity to Supabase
  addDiagnostic(`Testing connectivity to ${supabaseUrl}...`);
  const connectivityResult = await testUrlConnectivity(supabaseUrl);
  
  report.connectivity.supabaseReachable = connectivityResult.success;
  report.connectivity.message = connectivityResult.message;
  
  if (connectivityResult.success) {
    addDiagnostic(`Successfully connected to Supabase URL (${connectivityResult.message})`);
  } else {
    addDiagnostic(`Failed to connect to Supabase URL: ${connectivityResult.message}`, true);
  }
  
  // If we have connectivity, try to initialize Supabase client
  if (connectivityResult.success && supabaseKey) {
    addDiagnostic('Initializing Supabase client...');
    
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      addDiagnostic('Supabase client initialized');
      
      // Try a simple query
      addDiagnostic('Testing database connection with a simple query...');
      
      try {
        const { data, error } = await supabase
          .from('agents')
          .select('count(*)', { count: 'exact', head: true });
          
        if (error) {
          addDiagnostic(`Database query failed: ${error.message}`, true);
        } else {
          addDiagnostic('Database query successful');
        }
      } catch (error) {
        addDiagnostic(`Error executing database query: ${error.message}`, true);
      }
    } catch (error) {
      addDiagnostic(`Error initializing Supabase client: ${error.message}`, true);
    }
  }
  
  // Generate and save report
  fs.writeFileSync('supabase-diagnostic-report.md', generateMarkdownReport());
  console.log('\nDiagnostics completed at:', new Date().toISOString());
  console.log('Report saved to supabase-diagnostic-report.md');
}

// Run diagnostics
runDiagnostics().catch(error => {
  console.error('Error running diagnostics:', error);
  process.exit(1);
});
