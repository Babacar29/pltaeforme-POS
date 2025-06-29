import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://smqtdafxqkzsjsahjkvw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtcXRkYWZ4cWt6c2pzYWhqa3Z3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzA2NjAsImV4cCI6MjA2NTg0NjY2MH0.K61xpmbmdTkptXqrl-3rvBf85l-QhhG1H_YtNcmjCvM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);