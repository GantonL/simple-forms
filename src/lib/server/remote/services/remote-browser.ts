import { BASE_APP_URL, BROWSER_SERVICE_HOST, BROWSER_SERVICE_PORT } from '$env/static/private';

const baseUrl = `http://${BROWSER_SERVICE_HOST}:${BROWSER_SERVICE_PORT}`;

function createPdfParameters(parameters: { formPublicLinkIndentifier: string }) {
	return {
		url: `${BASE_APP_URL}/r/${parameters.formPublicLinkIndentifier}`,
		webhookUrl: `${BASE_APP_URL}/api/webhooks/forms/process`,
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
