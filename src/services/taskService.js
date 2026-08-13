import { supabase } from '../config/supabase';

export const taskService = {
  // Ambil semua tugas milik user yang sedang login
  getTasks: async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Tambah tugas baru
  createTask: async (taskData) => {
    // taskData: { title, description, type, difficulty }
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { 
          ...taskData, 
          user_id: userData.user.id 
        }
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  // Update tugas (termasuk status selesai/belum)
  updateTask: async (id, updates) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  // Hapus tugas
  deleteTask: async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
