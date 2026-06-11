
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rrbuohgflmaqvdfimdbf.supabase.co'   // ← deine URL (ohne /rest/v1/)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYnVvaGdmbG1hcXZkZmltZGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTU0NDEsImV4cCI6MjA5NjczMTQ0MX0.wHJKIAFpIEPeHYrSfHzSEgpVm09_171QQu1ahFXlDZE' 
// ← Hier deinen kompletten anon key einfügen (kopiere ihn frisch aus Supabase → Settings → API Keys → anon)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)