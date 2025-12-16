import { randomBytes } from 'crypto';

export function generateStrongPassword(length = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const hasLower = /[a-z]/;
    const hasUpper = /[A-Z]/;
    const hasNumber = /[0-9]/;
    const hasSpecial = /[!@#$%^&*]/;

    let password = '';
    while (true) {
        password = '';
        const bytes = randomBytes(length);
        for (let i = 0; i < length; i++) {
            password += charset[bytes[i] % charset.length];
        }

        // Ensure complexity requirements met
        if (hasLower.test(password) &&
            hasUpper.test(password) &&
            hasNumber.test(password) &&
            hasSpecial.test(password)) {
            return password;
        }
    }
}
