import { client } from './providers/supbase/client';

export interface FileUploadOptions {
	bucket?: string;
	contentType?: string;
}
export interface GetSignedUrlOptions {
	bucket?: string;
	expirySeconds?: number;
}
export async function uploadFile(file: File, path: string, options?: FileUploadOptions) {
	return client.storage.from(options?.bucket ?? 'forms').upload(path, file, {
		contentType: options?.contentType ?? 'application/pdf'
	});
}
export async function getSignedUrl(path: string, options?: GetSignedUrlOptions) {
	return client.storage
		.from(options?.bucket ?? 'forms')
		.createSignedUrl(path, options?.expirySeconds ?? 3600);
}
