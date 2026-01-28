import container from './components/container';
import document from './components/document';
import footer from './components/footer';
import header from './components/header';

export default (parameters: {
	formName: string;
	signee: string;
	signedAt: string;
	signedFormDownloadUrl: string;
}) => {
	return {
		subject: `Your signed form is ready!`,
		body: `
  		${document(`
    		${container(`
            ${header({ title: '✓ Form Signed' })}

            <div style="padding: clamp(20px, 5vw, 40px);">
                <p style="margin: 0 0 25px 0; color: #3f4044; font-size: 15px; line-height: 1.6;">
                    Dear <strong>${parameters.signee}</strong>, your signed form is ready!
                </p>

                <!-- Form Details Box -->
                <div style="background-color: #f0f1f3; border-left: 4px solid #5ab3a0; border-radius: 6px; margin: 25px 0; padding: clamp(16px, 4vw, 24px);">
                    <p style="margin: 0 0 16px 0; color: #737578; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Signature Details
                    </p>

                    <!-- Form Name -->
                    <div style="margin-bottom: 16px;">
                        <div style="color: #737578; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                            Form Name:
                        </div>
                        <div style="color: #3f4044; font-size: 14px;">
                          ${parameters.formName}
                        </div>
                    </div>

                    <!-- Signed By -->
                    <div style="margin-bottom: 16px;">
                        <div style="color: #737578; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                            Signed By:
                        </div>
                        <div style="color: #3f4044; font-size: 14px; word-break: break-word;">
                          ${parameters.signee}
                        </div>
                    </div>

                    <!-- Signed On -->
                    <div style="margin-bottom: 16px;">
                        <div style="color: #737578; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                            Signed On:
                        </div>
                        <div style="color: #3f4044; font-size: 14px;">
                          ${parameters.signedAt}
                        </div>
                    </div>

                    <!-- Status -->
                    <div>
                        <div style="color: #737578; font-size: 14px; font-weight: 600; margin-bottom: 4px;">
                            Status:
                        </div>
                        <span style="display: inline-block; padding: 5px 14px; background-color: #d4ede7; color: #3f4044; font-size: 13px; font-weight: 600; border-radius: 12px;">
                            ✓ Completed
                        </span>
                    </div>
                </div>

                <!-- Action Button -->
                <div style="text-align: center; margin: 30px 0 20px 0;">
                    <a href="${parameters.signedFormDownloadUrl}" style="display: inline-block; padding: 14px 32px; background-color: #5ab3a0; color: #fcfcfd; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                        Download Signed Form
                    </a>
                </div>

                <p style="margin: 25px 0 0 0; color: #737578; font-size: 13px; line-height: 1.5;">
                  The link is valid for 24 hours. Beyond that, you won't be able to download the signed form. Contact the form owner if you need to download the form but the link has expired
                </p>
            </div>

            ${footer({
							note: 'You see this email because you have requested a copy of your signed form'
						})}
        `)}
  		`)}
    `
	};
};
