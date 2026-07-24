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
    
    // Si Vercel no lee las variables de entorno durante el build, usará estas cadenas directas y no crasheará
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://toiqgwqvyobgyzczbcmk.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaXFnd3F2eW9iZ3l6Y3piY21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTkxNTgsImV4cCI6MjEwMDI5NTE1OH0.dGwqwl96Z9sywMJH6EDjDUkbBFV8HOB0uB57VqRgzcg';
    
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