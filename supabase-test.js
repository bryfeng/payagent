// Simple Node.js script to test Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Supabase configuration
const supabaseUrl = 'https://kjcvqvwocgabjyiknzbh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

// Check if Supabase key is available
if (!supabaseKey) {
  console.error('❌ Supabase key is missing. Please check your environment variables.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize report object
const report = {
  timestamp: new Date().toISOString(),
  connection: {
    success: false,
    message: ''
  },
  tables: {},
  summary: {
    success: false,
    tablesChecked: 0,
    tablesSuccessful: 0
  }
};

// Test tables
const tables = ['agents', 'customers', 'events', 'items'];

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test connection by getting the current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error connecting to Supabase:', userError.message);
      report.connection = {
        success: false,
        message: `Error connecting to Supabase: ${userError.message}`
      };
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase');
    report.connection = {
      success: true,
      message: 'Successfully connected to Supabase'
    };
    return true;
  } catch (error) {
    console.error('❌ Unexpected error testing Supabase:', error.message);
    report.connection = {
      success: false,
      message: `Unexpected error: ${error.message}`
    };
    return false;
  }
}

async function testTable(tableName) {
  console.log(`Testing '${tableName}' table...`);
  
  try {
    // Test read operation
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .limit(5);
      
    if (error) {
      console.error(`❌ Error reading from '${tableName}':`, error.message);
      report.tables[tableName] = {
        success: false,
        message: `Error reading from '${tableName}': ${error.message}`,
        count: 0,
        sampleData: null
      };
      return false;
    }
    
    console.log(`✅ Successfully read ${data.length} records from '${tableName}'`);
    if (data.length > 0) {
      console.log('Sample data:', JSON.stringify(data[0], null, 2).substring(0, 100) + '...');
    } else {
      console.log('No records found in table');
    }
    
    report.tables[tableName] = {
      success: true,
      message: `Successfully read from '${tableName}'`,
      count: count,
      sampleData: data.length > 0 ? data[0] : null
    };
    return true;
  } catch (error) {
    console.error(`❌ Unexpected error testing '${tableName}' operations:`, error.message);
    report.tables[tableName] = {
      success: false,
      message: `Unexpected error: ${error.message}`,
      count: 0,
      sampleData: null
    };
    return false;
  }
}

function generateMarkdownReport() {
  let md = `# Supabase Connection Test Report
Generated: ${new Date(report.timestamp).toLocaleString()}

## Connection Test
Status: ${report.connection.success ? '✅ PASSED' : '❌ FAILED'}
Message: ${report.connection.message}

`;

  if (report.connection.success) {
    md += `## Table Tests\n\n`;
    
    Object.keys(report.tables).forEach(table => {
      const test = report.tables[table];
      md += `### ${table} Table
Status: ${test.success ? '✅ PASSED' : '❌ FAILED'}
Message: ${test.message}
Record Count: ${test.count || 0}

`;

      if (test.success && test.sampleData) {
        md += `#### Sample Data
\`\`\`json
${JSON.stringify(test.sampleData, null, 2)}
\`\`\`

`;
      }
    });
    
    md += `## Summary
- Connection Test: ${report.connection.success ? '✅ PASSED' : '❌ FAILED'}
- Tables Checked: ${report.summary.tablesChecked}
- Tables Successfully Tested: ${report.summary.tablesSuccessful}
- Overall Status: ${report.summary.success ? '✅ PASSED' : '❌ FAILED'}
`;
  }
  
  return md;
}

async function runTests() {
  console.log('=== SUPABASE CONNECTION TEST ===');
  console.log('Starting tests at:', new Date().toISOString());
  console.log('-------------------------------');
  
  // Test connection
  const connectionSuccess = await testConnection();
  
  // If connection failed, don't proceed with table tests
  if (!connectionSuccess) {
    console.log('\n❌ Connection test failed. Skipping table tests.');
    fs.writeFileSync('report.md', generateMarkdownReport());
    console.log('Report saved to report.md');
    return;
  }
  
  console.log('\n=== TABLE OPERATIONS TESTS ===');
  
  // Test each table
  report.summary.tablesChecked = tables.length;
  
  for (const table of tables) {
    const success = await testTable(table);
    if (success) {
      report.summary.tablesSuccessful++;
    }
  }
  
  // Set overall success
  report.summary.success = 
    report.connection.success && 
    report.summary.tablesSuccessful === report.summary.tablesChecked;
  
  // Generate and save report
  fs.writeFileSync('report.md', generateMarkdownReport());
  console.log('\n=== TEST SUMMARY ===');
  console.log('Connection Test:', report.connection.success ? '✅ PASSED' : '❌ FAILED');
  
  for (const table of tables) {
    console.log(`'${table}' Table Test:`, report.tables[table]?.success ? '✅ PASSED' : '❌ FAILED');
  }
  
  console.log('\nOverall Status:', report.summary.success ? '✅ PASSED' : '❌ FAILED');
  console.log('Tests completed at:', new Date().toISOString());
  console.log('Report saved to report.md');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
});
