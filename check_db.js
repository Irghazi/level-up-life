import { supabase } from './src/config/supabase.js';
async function run() {
  const { data, error } = await supabase.from('users_profile').select('hp').limit(1);
  console.log("DATA:", data, "ERROR:", error);
}
run();
