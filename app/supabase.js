import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = "https://rusfhjfwqwqfucybbplq.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1c2ZoamZ3cXdxZnVjeWJicGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMzc2MTAsImV4cCI6MjAyOTcxMzYxMH0.ofm8mcfDqxS2OWGqxFi692URjbmAwwBwTmC3Yo-5CZ4";

export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);


