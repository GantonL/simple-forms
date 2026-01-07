import { BASE_APP_URL, BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';
import { AppName } from '$lib/api/configurations/common';

const baseUrl = `http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`;

function createHeaderTemplate(formName: string): string {
	return `
		<div style="width: 100%; font-size: 10px; padding: 8px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; color: #374151;">
			<div style="font-weight: 600; color: #111827;">${AppName}</div>
			<div style="color: #6b7280;">${formName}</div>
		</div>
	`;
}

function createFooterTemplate(): string {
	return `
		<div style="width: 100%; font-size: 9px; padding: 8px 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: center; align-items: center; color: #6b7280;">
			<span class="pageNumber"></span> / <span class="totalPages"></span>
		</div>
	`;
}

function createPdfParameters(parameters: {
	formPublicLinkIndentifier: string;
	formId: number;
	formName: string;
}) {
	return {
		url: `${BASE_APP_URL}/r/${parameters.formPublicLinkIndentifier}`,
		webhook: {
			url: `${BASE_APP_URL}/api/webhooks/forms/${parameters.formId}/process`
		},
		containerClass: 'form',
		options: {
			displayHeaderFooter: true,
			headerTemplate: createHeaderTemplate(parameters.formName),
			footerTemplate: createFooterTemplate(),
			margin: {
				top: '25mm',
				bottom: '20mm',
				left: '10mm',
				right: '10mm'
			}
		}
	};
}

export const requestPdfCreation = async (parameters: {
	formPublicLinkIndentifier: string;
	formId: number;
	formName: string;
}): Promise<boolean> => {
	const res = await fetch(`${baseUrl}/pdf`, {
		method: 'POST',
		body: JSON.stringify(createPdfParameters(parameters))
	});
	if (!res?.ok) return false;
	const response = await res.json();
	console.log(response.message);
	return true;
};
