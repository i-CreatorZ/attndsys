import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = 'https://rusfhjfwqwqfucybbplq.supabase.co';
const NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1c2ZoamZ3cXdxZnVjeWJicGxxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDEzNzYxMCwiZXhwIjoyMDI5NzEzNjEwfQ.LCigTbnwTUuyWtXjgwaC0JRpsqj9kgsKF87ZCXt6qgk";

export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);


