/**
 * User-specific data for a form instance created from a template.
 * Contains customized text blocks and field values.
 */
export interface UserFormData {
	/**
	 * User's customized values for editable text blocks from the template.
	 * Maps block ID to customized content.
	 */
	editableTextBlocks?: Record<string, string>;

	/**
	 * User's input values for form fields.
	 * Maps field ID to the user's provided value.
	 */
	fields?: Record<string, string | number | boolean | string[]>;
}
