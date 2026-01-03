const CONTROLLER = '/api';
export const Locale = `${CONTROLLER}/locale`;
export const ManageCookies = `${CONTROLLER}/manage-cookies`;
export const FormsTemplates = `${CONTROLLER}/templates`;
export const UsersForms = `${CONTROLLER}/users-forms`;
export const FormsSubmissions = `${CONTROLLER}/forms-submissions`;
export const UploadUrl = `${CONTROLLER}/upload-url`;
export const SignedUrl = (id: number) => `${CONTROLLER}/storage/${String(id)}/signed-url`;
export const RemoteBrowserServiceCreatePdf = `${CONTROLLER}/remote/browser-service/pdf`;
