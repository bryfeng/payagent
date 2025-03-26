import { testSupabaseConnection, testTableOperations } from '../utils/supabase-test';

async function runTests() {
  console.log('=== SUPABASE CONNECTION TEST ===');
  console.log('Starting tests at:', new Date().toISOString());
  console.log('-------------------------------');
  
  // Test 1: Basic connection test
  const connectionResult = await testSupabaseConnection();
  console.log('\nConnection Test Result:', connectionResult.success ? '✅ PASSED' : '❌ FAILED');
  console.log(connectionResult.message);
  
  // If connection failed, don't proceed with table tests
  if (!connectionResult.success) {
    console.log('\n❌ Connection test failed. Skipping table tests.');
    return;
  }
  
  console.log('\n=== TABLE OPERATIONS TESTS ===');
  
  // Test 2: Test operations on each table
  const tables = ['agents', 'customers', 'events', 'items'];
  const tableResults = {};
  
  for (const table of tables) {
    console.log(`\nTesting '${table}' table...`);
    console.log('-------------------------------');
    
    const result = await testTableOperations(table);
    tableResults[table] = result;
    
    console.log(`'${table}' Test Result:`, result.success ? '✅ PASSED' : '❌ FAILED');
    console.log(result.message);
  }
  
  // Generate summary
  console.log('\n=== TEST SUMMARY ===');
  console.log('Connection Test:', connectionResult.success ? '✅ PASSED' : '❌ FAILED');
  
  for (const table of tables) {
    console.log(`'${table}' Table Test:`, tableResults[table]?.success ? '✅ PASSED' : '❌ FAILED');
  }
  
  console.log('\nTests completed at:', new Date().toISOString());
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});
