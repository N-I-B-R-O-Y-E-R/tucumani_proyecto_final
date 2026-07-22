import { createClient } from '@supabase/supabase-js';

class DatabaseAdapter {
  async insert(table, data) { throw new Error("No implementado"); }
  async get(table, query) { throw new Error("No implementado"); }
  async update(table, id, data) { throw new Error("No implementado"); }
}

export class SupabaseAdapter extends DatabaseAdapter {
  constructor() {
    super();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async get(table, matchQuery = {}) {
    const { data, error } = await this.client.from(table).select('*').match(matchQuery);
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
    return data;
  }
}

export const db = new SupabaseAdapter();