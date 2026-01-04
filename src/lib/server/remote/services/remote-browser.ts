import { BASE_APP_URL, BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';

const baseUrl = `http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`;

function createPdfParameters(parameters: { formPublicLinkIndentifier: string; formId: number }) {
	return {
		url: `${BASE_APP_URL}/r/${parameters.formPublicLinkIndentifier}`,
		webhook: {
			url: `${BASE_APP_URL}/api/webhooks/forms/${parameters.formId}/process`
		},
		containerClass: 'form',
		options: {
			margin: {
				top: '10mm',
				bottom: '10mm',
				left: '10mm',
				right: '10mm'
			}
		}
	};
}

export const requestPdfCreation = async (parameters: {
	formPublicLinkIndentifier: string;
	formId: number;
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
