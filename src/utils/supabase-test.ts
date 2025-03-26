import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Utility to test Supabase connection and basic operations
 */
export async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not properly configured. Check your environment variables.');
    return {
      success: false,
      message: 'Supabase is not properly configured. Check your environment variables.',
      data: null
    };
  }
  
  try {
    // Test connection by getting the current user
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ Error connecting to Supabase:', userError.message);
      return {
        success: false,
        message: `Error connecting to Supabase: ${userError.message}`,
        data: null
      };
    }
    
    console.log('✅ Successfully connected to Supabase');
    
    // Test database access by checking table existence
    const tables = ['agents', 'customers', 'events', 'items'];
    const tableResults = {};
    
    for (const table of tables) {
      try {
        // Attempt to count records in each table
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          tableResults[table] = {
            exists: false,
            error: error.message,
            count: null
          };
        } else {
          tableResults[table] = {
            exists: true,
            error: null,
            count
          };
          console.log(`✅ Table '${table}' exists with ${count} records`);
        }
      } catch (error) {
        tableResults[table] = {
          exists: false,
          error: error.message,
          count: null
        };
        console.error(`❌ Error checking table '${table}':`, error.message);
      }
    }
    
    return {
      success: true,
      message: 'Supabase connection test completed',
      data: {
        user,
        tables: tableResults
      }
    };
  } catch (error) {
    console.error('❌ Unexpected error testing Supabase:', error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      data: null
    };
  }
}

/**
 * Test specific table operations
 */
export async function testTableOperations(tableName: string) {
  console.log(`Testing operations on '${tableName}' table...`);
  
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not properly configured');
    return {
      success: false,
      message: 'Supabase is not properly configured',
      data: null
    };
  }
  
  try {
    // Test read operation
    const { data: readData, error: readError } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);
      
    if (readError) {
      console.error(`❌ Error reading from '${tableName}':`, readError.message);
      return {
        success: false,
        message: `Error reading from '${tableName}': ${readError.message}`,
        data: null
      };
    }
    
    console.log(`✅ Successfully read ${readData.length} records from '${tableName}'`);
    console.log('Sample data:', readData.length > 0 ? readData[0] : 'No records found');
    
    return {
      success: true,
      message: `Successfully tested read operations on '${tableName}'`,
      data: {
        sampleData: readData.slice(0, 5)
      }
    };
  } catch (error) {
    console.error(`❌ Unexpected error testing '${tableName}' operations:`, error);
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      data: null
    };
  }
}
