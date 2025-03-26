
import { testSupabaseConnection, testTableOperations } from './src/utils/supabase-test';

async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    connectionTest: null,
    tableTests: {},
    summary: {
      success: false,
      tablesChecked: 0,
      tablesSuccessful: 0
    }
  };

  // Test connection
  console.log('Testing Supabase connection...');
  report.connectionTest = await testSupabaseConnection();
  
  if (!report.connectionTest.success) {
    report.summary.success = false;
    console.log('❌ Connection test failed. Skipping table tests.');
    
    // Write report to file
    fs.writeFileSync('report.md', generateMarkdownReport(report));
    console.log('Report saved to report.md');
    return;
  }
  
  // Test tables
  const tables = ['agents', 'customers', 'events', 'items'];
  report.summary.tablesChecked = tables.length;
  
  for (const table of tables) {
    console.log(`Testing '${table}' table...`);
    const result = await testTableOperations(table);
    report.tableTests[table] = result;
    
    if (result.success) {
      report.summary.tablesSuccessful++;
    }
  }
  
  // Set overall success
  report.summary.success = report.summary.tablesSuccessful === report.summary.tablesChecked;
  
  // Write report to file
  fs.writeFileSync('report.md', generateMarkdownReport(report));
  console.log('Report saved to report.md');
}

function generateMarkdownReport(report) {
  let md = `# Supabase Connection Test Report
Generated: ${new Date(report.timestamp).toLocaleString()}

## Connection Test
Status: ${report.connectionTest.success ? '✅ PASSED' : '❌ FAILED'}
Message: ${report.connectionTest.message}

`;

  if (report.connectionTest.success) {
    md += `## Table Tests

`;
    
    Object.keys(report.tableTests).forEach(table => {
      const test = report.tableTests[table];
      md += `### ${table} Table
Status: ${test.success ? '✅ PASSED' : '❌ FAILED'}
Message: ${test.message}

`;

      if (test.success && test.data?.sampleData?.length > 0) {
        md += `#### Sample Data
```json
${JSON.stringify(test.data.sampleData[0], null, 2)}
```

`;
      }
    });
    
    md += `## Summary
- Connection Test: ${report.connectionTest.success ? '✅ PASSED' : '❌ FAILED'}
- Tables Checked: ${report.summary.tablesChecked}
- Tables Successfully Tested: ${report.summary.tablesSuccessful}
- Overall Status: ${report.summary.success ? '✅ PASSED' : '❌ FAILED'}
`;
  }
  
  return md;
}

generateReport().catch(error => {
  console.error('Error generating report:', error);
  process.exit(1);
});
  