
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabase = createClient(supabaseUrl, serviceRoleKey);

        // 1. Get Users
        const { data: { users }, error: authError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });

        // 2. Check for 'companies' table
        const { data: companies, error: compError } = await supabase.from('companies').select('*').limit(5);

        // 3. Check for 'company_settings' table
        const { data: companySettings, error: setError } = await supabase.from('company_settings').select('*').limit(5);

        // 4. Return
        return NextResponse.json({
            usersSample: users?.map(u => ({ id: u.id, email: u.email, metadata: u.user_metadata })),
            companies: { data: companies, error: compError },
            companySettings: { data: companySettings, error: setError }
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}
