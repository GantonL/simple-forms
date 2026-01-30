import type { FormTemplateSchema } from '$lib/models/form-temaplte-schema';

export type SectionItem = {
	type: 'text' | 'field';
	id: string;
};

export const parseSectionItem = (item: string, schema: FormTemplateSchema): SectionItem | null => {
	// Check if it's a field reference (format: "fields:field_id")
	if (item.startsWith('fields:')) {
		const fieldId = item.substring(7); // Remove "fields:" prefix
		const field = schema.fields?.find((f) => f.id === fieldId);
		if (field) {
			return { type: 'field', id: fieldId };
		}
	} else {
		const textBlock = schema.editableTextBlocks?.find((block) => block.id === item);
		if (textBlock) {
			return { type: 'text', id: item };
		}
	}
	return null;
};

export const getField = (fieldId: string, schema: FormTemplateSchema) => {
	return schema.fields?.find((f) => f.id === fieldId);
};

export const getTextBlock = (blockId: string, schema: FormTemplateSchema) => {
	return schema.editableTextBlocks?.find((b) => b.id === blockId);
};
