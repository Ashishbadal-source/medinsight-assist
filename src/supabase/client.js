import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://yenguyiwjitciliilqet.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inllbmd1eWl3aml0Y2lsaWlscWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwNzY5MzEsImV4cCI6MjA4MTY1MjkzMX0.X7RvsvM6i6l11jqnILyNrIlW1188E2J7UXrz2v8LkVE"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)



// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// export const supabase = createClient(
//   supabaseUrl,
//   supabaseAnonKey
// );
