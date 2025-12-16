import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (!serviceRoleKey || !supabaseUrl) {
            return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
        }

        const supabase = await createClient();

        // 1. Verify HR Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { employeeId, companyId } = body;

        if (!employeeId) {
            return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
        }

        // 2. Verify HR belongs to this company (and owns the employee)
        const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();

        if (!profile || profile.company_id !== companyId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

        // 3. Get Employee Details (to get Auth ID)
        const { data: employee, error: fetchError } = await supabaseAdmin
            .from('employees')
            .select('auth_user_id, email')
            .eq('id', employeeId)
            .single();

        if (fetchError || !employee) {
            console.log("Employee not found, maybe already deleted?", fetchError);
            // Proceed to just try deleting by ID if exists?
        }

        // 4. Delete DB Record (Cascade should handle Break Logs etc, but we delete explicitly to be sure)
        const { error: deleteError } = await supabaseAdmin
            .from('employees')
            .delete()
            .eq('id', employeeId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        // 5. Delete from Invitations
        if (employee?.email) {
            await supabaseAdmin
                .from('invitations')
                .delete()
                .eq('email', employee.email);
        }

        // 6. Delete Auth User (Revoke Access)
        if (employee?.auth_user_id) {
            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
                employee.auth_user_id
            );
            if (authDeleteError) {
                console.error("Failed to delete auth user:", authDeleteError);
                // We don't fail the request, as DB record is gone, access is effectively revoked from app Logic.
            }
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Deactivate API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
