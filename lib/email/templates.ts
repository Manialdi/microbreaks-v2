
export const getInviteEmailTemplate = (link: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MicroBreaks</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">MicroBreaks</h1>
    </div>

    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="margin-top: 0; color: #111827;">You've been invited! 👋</h2>
        
        <p style="color: #4b5563; margin-bottom: 24px;">
            Your HR administrator has invited you to join MicroBreaks to help you stay healthy and productive at work.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Step 1: Create your password</p>
            <p style="margin: 0; font-size: 14px; color: #6b7280; margin-bottom: 16px;">Click the button below to set up your account password.</p>
            
            <a href="${link}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-align: center;">Set Password & Join</a>
        </div>

        <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border: 1px solid #dbeafe;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">Step 2: Install Chrome Extension</p>
            <p style="margin: 0; font-size: 14px; color: #1e3a8a; margin-bottom: 16px;">Once you have your password, download the extension to get started.</p>
            
            <a href="https://chrome.google.com/webstore/detail/placeholder-link" style="display: inline-block; background-color: #ffffff; color: #2563eb; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; border: 1px solid #2563eb; font-size: 14px;">Download Extension</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 13px; color: #9ca3af; text-align: center;">
            If you didn't expect this invitation, you can ignore this email.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} MicroBreaks. All rights reserved.</p>
    </div>
</body>
</html>
`;

export const getCredentialsEmailTemplate = (email: string, password: string, extensionLink: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to MicroBreaks</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">MicroBreaks</h1>
    </div>

    <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h2 style="margin-top: 0; color: #111827;">You've been invited! 👋</h2>
        
        <p style="color: #4b5563; margin-bottom: 24px;">
            Your HR administrator has invited you to join MicroBreaks. We've created an account for you.
        </p>

        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <p style="margin: 0 0 15px 0; font-weight: 600; color: #374151;">Your Login Credentials</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 15px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Email</p>
                <p style="margin: 0; font-family: monospace; font-size: 16px; color: #111827;">${email}</p>
            </div>

            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Password</p>
                <p style="margin: 0; font-family: monospace; font-size: 16px; color: #111827; letter-spacing: 1px;">${password}</p>
            </div>
            
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #6b7280;">Please keep these credentials safe.</p>
        </div>

        <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border: 1px solid #dbeafe;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">Next Step: Install Chrome Extension</p>
            <p style="margin: 0; font-size: 14px; color: #1e3a8a; margin-bottom: 16px;">Download the extension and log in with the credentials above.</p>
            
            <a href="${extensionLink}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; text-align: center;">Download Extension</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 13px; color: #9ca3af; text-align: center;">
            If you have any trouble logging in, please contact your administrator.
        </p>
    </div>
    
    <div style="text-align: center; margin-top: 20px;">
        <p style="font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} MicroBreaks. All rights reserved.</p>
    </div>
</body>
</html>
`;
