import { supabase } from './supabase'

/**
 * Database helper functions
 * Provides a clean API for common database operations
 */

// Generic query helper
export async function query<T = any>(
  table: string,
  filters?: Record<string, any>
): Promise<{ data: T[] | null; error: any }> {
  try {
    let queryBuilder = supabase.from(table).select('*')

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value)
      })
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error(`Query error on ${table}:`, error)
      return { data: null, error }
    }

    return { data: data as T[], error: null }
  } catch (error) {
    console.error(`Unexpected error querying ${table}:`, error)
    return { data: null, error }
  }
}

// Generic insert helper
export async function insert<T = any>(
  table: string,
  data: Record<string, any> | Record<string, any>[]
): Promise<{ data: T | null; error: any }> {
  try {
    const { data: insertedData, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) {
      console.error(`Insert error on ${table}:`, error)
      return { data: null, error }
    }

    return { data: insertedData as T, error: null }
  } catch (error) {
    console.error(`Unexpected error inserting into ${table}:`, error)
    return { data: null, error }
  }
}

// Generic update helper
export async function update<T = any>(
  table: string,
  id: string,
  updates: Record<string, any>
): Promise<{ data: T | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(`Update error on ${table}:`, error)
      return { data: null, error }
    }

    return { data: data as T, error: null }
  } catch (error) {
    console.error(`Unexpected error updating ${table}:`, error)
    return { data: null, error }
  }
}

// Generic delete helper
export async function deleteRecord(
  table: string,
  id: string
): Promise<{ success: boolean; error: any }> {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Delete error on ${table}:`, error)
      return { success: false, error }
    }

    return { success: true, error: null }
  } catch (error) {
    console.error(`Unexpected error deleting from ${table}:`, error)
    return { success: false, error }
  }
}

// Get single record by ID
export async function getById<T = any>(
  table: string,
  id: string
): Promise<{ data: T | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error(`GetById error on ${table}:`, error)
      return { data: null, error }
    }

    return { data: data as T, error: null }
  } catch (error) {
    console.error(`Unexpected error getting record from ${table}:`, error)
    return { data: null, error }
  }
}

// Count records
export async function count(
  table: string,
  filters?: Record<string, any>
): Promise<{ count: number | null; error: any }> {
  try {
    let queryBuilder = supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryBuilder = queryBuilder.eq(key, value)
      })
    }

    const { count, error } = await queryBuilder

    if (error) {
      console.error(`Count error on ${table}:`, error)
      return { count: null, error }
    }

    return { count, error: null }
  } catch (error) {
    console.error(`Unexpected error counting ${table}:`, error)
    return { count: null, error }
  }
}

// Advanced query with custom select, filters, sorting, pagination
export async function advancedQuery<T = any>(options: {
  table: string
  select?: string
  filters?: Record<string, any>
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  offset?: number
}): Promise<{ data: T[] | null; error: any; count?: number }> {
  try {
    let queryBuilder = supabase
      .from(options.table)
      .select(options.select || '*', { count: 'exact' })

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryBuilder = queryBuilder.eq(key, value)
        }
      })
    }

    // Apply sorting
    if (options.orderBy) {
      queryBuilder = queryBuilder.order(
        options.orderBy.column,
        { ascending: options.orderBy.ascending ?? false }
      )
    }

    // Apply pagination
    if (options.limit !== undefined) {
      queryBuilder = queryBuilder.limit(options.limit)
    }
    if (options.offset !== undefined) {
      queryBuilder = queryBuilder.range(
        options.offset,
        options.offset + (options.limit || 10) - 1
      )
    }

    const { data, error, count } = await queryBuilder

    if (error) {
      console.error(`Advanced query error on ${options.table}:`, error)
      return { data: null, error, count: undefined }
    }

    return { data: data as T[], error: null, count: count ?? undefined }
  } catch (error) {
    console.error(`Unexpected error in advanced query:`, error)
    return { data: null, error, count: undefined }
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('leads').select('count').limit(1)

    if (error) {
      console.error('Database connection test failed:', error)
      return false
    }

    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('Database connection test error:', error)
    return false
  }
}
