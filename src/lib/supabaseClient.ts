/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fxzuhonhkzgihbviazgi.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Dnp_NI5QX4UcpDuaF12LAQ_7FU7mtoo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
