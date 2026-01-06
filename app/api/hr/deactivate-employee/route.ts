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
        const { data: employee } = await supabaseAdmin
            .from('employees')
            .select('auth_user_id, email')
            .eq('id', employeeId)
            .maybeSingle();

        // 4. Delete DB Record (Employees)
        const { error: deleteError } = await supabaseAdmin
            .from('employees')
            .delete()
            .eq('id', employeeId);

        if (deleteError) {
            console.error("Failed to delete employee record:", deleteError);
            throw new Error("Failed to remove employee from directory.");
        }

        // 5. Delete from Invitations
        if (employee?.email) {
            await supabaseAdmin
                .from('invitations')
                .delete()
                .eq('email', employee.email);
        }

        // 6. Delete Auth User (Revoke Access completely)
        // This is crucial to prevent "Zombie" users that auto-link on re-invite
        if (employee?.auth_user_id) {
            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
                employee.auth_user_id
            );

            if (authDeleteError) {
                console.error("Failed to delete auth user:", authDeleteError);
                // We proceed, but warn. This might happen if user has other dependencies.
                // However, since we deleted the 'employees' record, they effectively lose access.
            } else {
                console.log(`Auth user ${employee.auth_user_id} deleted successfully.`);
            }
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error("Deactivate API Error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
