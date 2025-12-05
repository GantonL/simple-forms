import { SUPABAE_API_KEY, SUPBASE_PROJECT_URL } from '$env/static/private';
import { createClient } from '@supabase/supabase-js';

export const client = createClient(SUPBASE_PROJECT_URL, SUPABAE_API_KEY);
