import { createClient, SupabaseClient } from '@supabase/supabase-js';

class DatabaseAdapter {
  async insert(): Promise<unknown> { throw new Error("No implementado"); }
  async get(): Promise<unknown> { throw new Error("No implementado"); }
  async update(): Promise<unknown> { throw new Error("No implementado"); }
  async delete(): Promise<unknown> { throw new Error("No implementado"); }
}

export class SupabaseAdapter extends DatabaseAdapter {
  public client: SupabaseClient;

  constructor() {
    super();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://toiqgwqvyobgyzczbcmk.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvaXFnd3F2eW9iZ3l6Y3piY21rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTkxNTgsImV4cCI6MjEwMDI5NTE1OH0.dGwqwl96Z9sywMJH6EDjDUkbBFV8HOB0uB57VqRgzcg';
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  async insert(table: string, data: Record<string, unknown>): Promise<unknown> {
    const { data: result, error } = await this.client.from(table).insert(data).select();
    if (error) {
      // Eliminamos el console.error de aquí. Lanzamos el error directamente a la UI.
      throw error;
    }
    return result;
  }

  async get(table: string, matchQuery: Record<string, unknown> = {}): Promise<unknown[]> {
    const { data, error } = await this.client.from(table).select('*').match(matchQuery);
    if (error) {
      return []; 
    }
    return data || [];
  }

  async update(table: string, id: string, data: Record<string, unknown>): Promise<unknown> {
    const { data: result, error } = await this.client.from(table).update(data).eq('id', id).select();
    if (error) throw error;
    return result;
  }

  async delete(table: string, id: string): Promise<unknown> {
    const { error } = await this.client.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  }
}

export const db = new SupabaseAdapter();