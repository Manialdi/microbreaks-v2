export type InvitationStatus = 'pending' | 'accepted' | 'expired';

export interface Company {
    id: string;
    name: string;
    domain: string; // Ensure this exists
    logo_url: string | null;
    industry: string | null;
}

export interface Employee {
    id: string;
    company_id: string;
    user_id: string | null;
    email: string;
    name: string | null;
    department: string | null;
    status: 'active' | 'invited' | 'disabled';
    created_at: string;
    last_active_at: string | null;
    employee_id: string | null; // internal Employee ID e.g. EMP001
}
