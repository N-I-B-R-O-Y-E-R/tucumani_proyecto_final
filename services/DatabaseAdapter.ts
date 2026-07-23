import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Asignamos Promise<any> a la clase base para que coincida con el hijo
class DatabaseAdapter {
  async insert(table: string, data: any): Promise<any> { throw new Error("No implementado"); }
  async get(table: string, query?: any): Promise<any> { throw new Error("No implementado"); }
  async update(table: string, id: string, data: any): Promise<any> { throw new Error("No implementado"); }
  async delete(table: string, id: string): Promise<any> { throw new Error("No implementado"); }
}

export class SupabaseAdapter extends DatabaseAdapter {
  public client: SupabaseClient;

  constructor() {
    super();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async insert(table: string, data: any): Promise<any> {
    const { data: result, error } = await this.client.from(table).insert(data).select();
    if (error) throw error;
    return result;
  }

  async get(table: string, matchQuery = {}): Promise<any> {
    const { data, error } = await this.client.from(table).select('*').match(matchQuery);
    if (error) throw error;
    return data;
  }

  async update(table: string, id: string, data: any): Promise<any> {
    const { data: result, error } = await this.client.from(table).update(data).eq('id', id).select();
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string): Promise<any> {
    const { error } = await this.client.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export const db = new SupabaseAdapter();