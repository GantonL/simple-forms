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

	/**
	 * Configuration for linked fields.
	 * Maps target field ID to source field ID.
	 * When the source field is updated, the target field should clearly reflect that value.
	 */
	linkedFields?: Record<string, string>;
}
