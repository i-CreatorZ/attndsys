import { createClient } from "@supabase/supabase-js";

const NEXT_PUBLIC_SUPABASE_URL = "https://yyimbhdetkjuzydxprqa.supabase.co";
const NEXT_PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aW1iaGRldGtqdXp5ZHhwcnFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNzEzMTIsImV4cCI6MjAzMDc0NzMxMn0.pF2Jx7pviBsa_1PivyKqqH2LaTzfl0FBiEEeDSuXSHM";

export const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY);