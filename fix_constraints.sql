-- Run this in Supabase SQL Editor

-- 1. Clean up duplicate employees (keep the latest one)
DELETE FROM employees a USING (
    SELECT min(ctid) as ctid, email
    FROM employees 
    GROUP BY email HAVING COUNT(*) > 1
) b
WHERE a.email = b.email 
AND a.ctid <> b.ctid;

-- 2. Add Unique Constraint to Employees
ALTER TABLE employees 
DROP CONSTRAINT IF EXISTS employees_email_unique;

ALTER TABLE employees 
ADD CONSTRAINT employees_email_unique UNIQUE (email);

-- 3. Clean up duplicate invitations
DELETE FROM invitations a USING (
    SELECT min(ctid) as ctid, email
    FROM invitations 
    GROUP BY email HAVING COUNT(*) > 1
) b
WHERE a.email = b.email 
AND a.ctid <> b.ctid;

-- 4. Add Unique Constraint to Invitations
ALTER TABLE invitations 
DROP CONSTRAINT IF EXISTS invitations_email_unique;

ALTER TABLE invitations 
ADD CONSTRAINT invitations_email_unique UNIQUE (email);
