import { db } from '../services/DatabaseAdapter';

export class UsuarioController {
  static async login(email: string, password: string) {
    try {
      // 🚀 MODO PRUEBA BD: Buscamos en Supabase SOLO por el correo, ignorando qué contraseña escribieron
      const users = await db.get('Usuarios', { email }) as any[];
      
      if (users.length === 0) {
        throw new Error('Ese correo no existe en la base de datos.');
      }
      
      if (users[0].rol === 'Inactivo') {
        throw new Error('Esta cuenta ha sido deshabilitada por el Administrador.');
      }
      
      return users[0]; // Devuelve tus datos y nombre real de Supabase
    } catch (error: any) {
      throw new Error(error.message || 'Error de autenticación');
    }
  }

  static async listarUsuarios() {
    try { return await db.get('Usuarios'); } 
    catch (err: any) { throw new Error(err.message); }
  }

  static async crearUsuario(nombre: string, email: string, password: string, rol: string) {
    try {
      return await db.insert('Usuarios', { nombre, email, password, rol });
    } catch (error: any) { throw new Error(error.message); }
  }

  static async deshabilitarUsuario(id: string) {
    try { return await db.update('Usuarios', id, { rol: 'Inactivo' }); } 
    catch (error: any) { throw new Error(error.message); }
  }

  static async reactivarUsuario(id: string) {
    try { return await db.update('Usuarios', id, { rol: 'Cajero' }); } 
    catch (error: any) { throw new Error(error.message); }
  }
}