import { SUPABASE_PROJECT_URL, SUPABASE_API_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

export const client = createClient(SUPABASE_PROJECT_URL, SUPABASE_API_KEY);
