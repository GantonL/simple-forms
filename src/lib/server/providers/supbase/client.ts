import { env } from '$env/dynamic/private';
import { createClient } from '@supabase/supabase-js';

export const client = createClient(env.SUPBASE_PROJECT_URL, env.SUPABASE_API_KEY);
