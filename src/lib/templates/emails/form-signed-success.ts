export default (parameters: {
	formName: string;
	signee: string;
	subscriber: string;
	signedAt: string;
}) => {
	return {
		subject: `Form named ${parameters.formName} signed by ${parameters.signee}`,
		body: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f8f9;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f7f8f9; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #fcfcfd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color: #5ab3a0; padding: 35px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #fcfcfd; font-size: 24px; font-weight: 600;">
                                ✓ Form Signed
                            </h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; color: #3f4044; font-size: 16px; line-height: 1.5;">
                                Hello <strong>${parameters.subscriber}</strong>,
                            </p>

                            <p style="margin: 0 0 25px 0; color: #3f4044; font-size: 15px; line-height: 1.6;">
                                Great news! <strong>${parameters.signee}</strong> has successfully signed your form.
                            </p>

                            <!-- Form Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f1f3; border-left: 4px solid #5ab3a0; border-radius: 6px; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 16px 0; color: #737578; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                                            Signature Details
                                        </p>

                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #737578; font-size: 14px; width: 35%;">
                                                    <strong>Form Name:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #3f4044; font-size: 14px;">
                                                ${parameters.formName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #737578; font-size: 14px;">
                                                    <strong>Signed By:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #3f4044; font-size: 14px;">
                                                ${parameters.signee}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #737578; font-size: 14px;">
                                                    <strong>Signed On:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #3f4044; font-size: 14px;">
                                                ${parameters.signedAt}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #737578; font-size: 14px;">
                                                    <strong>Status:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="display: inline-block; padding: 5px 14px; background-color: #d4ede7; color: #3f4044; font-size: 13px; font-weight: 600; border-radius: 12px;">
                                                        ✓ Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Action Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 20px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="{{$json.formUrl}}" style="display: inline-block; padding: 14px 32px; background-color: #5ab3a0; color: #fcfcfd; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                                            View Signed Form
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 25px 0 0 0; color: #737578; font-size: 13px; line-height: 1.5;">
                                You can access the completed form and all signature details in your dashboard at any time.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f0f1f3; padding: 25px 40px; text-align: center; border-top: 1px solid #dddfe3;">
                            <p style="margin: 0 0 8px 0; color: #737578; font-size: 13px;">
                                © 2026 Your App Name. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #9a9ca0; font-size: 12px;">
                                You're receiving this notification because you own this form.
                                <a href="{{$json.settingsUrl}}" style="color: #5ab3a0; text-decoration: none;">Manage Notifications</a>
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
	};
};
