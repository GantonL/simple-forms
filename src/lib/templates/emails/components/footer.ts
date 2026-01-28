import { AppName } from '$lib/api/configurations/common';

export default (parameters: { note: string; link?: { url: string; label: string } }) => {
	return `
	  <div style="background-color: #f0f1f3; padding: clamp(16px, 4vw, 25px) clamp(16px, 4vw, 40px); text-align: center; border-top: 1px solid #dddfe3;">
      <p style="margin: 0 0 8px 0; color: #737578; font-size: 13px; line-height: 1.5;">
          © ${new Date().getFullYear()} ${AppName}. All rights reserved.
      </p>
      <p style="margin: 0; color: #9a9ca0; font-size: 12px; line-height: 1.5;">
          ${parameters.note ? `${parameters.note}.<br>` : ''}
          ${parameters.link ? `<a href="${parameters.link.url}" style="color: #5ab3a0; text-decoration: none;">${parameters.link.label}</a>` : ''}
      </p>
    </div>
  `;
};
