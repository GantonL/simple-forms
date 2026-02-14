export type BlockType = 'text' | 'field';

export type FieldType = 'text' | 'email' | 'number' | 'tel' | 'textarea' | 'date' | 'signature';

export interface TextBlockProperties {
	content: string;
	label: string;
}

export interface FieldBlockProperties {
	label: string;
	fieldType: FieldType;
	required: boolean;
	disabled: boolean;
	placeholder?: string;
}

export interface CanvasBlock {
	id: string;
	type: BlockType;
	properties: TextBlockProperties | FieldBlockProperties;
}

export interface Section {
	id: string;
	blocks: CanvasBlock[];
}

export function isTextBlock(
	properties: TextBlockProperties | FieldBlockProperties
): properties is TextBlockProperties {
	return 'content' in properties;
}

export function isFieldBlock(
	properties: TextBlockProperties | FieldBlockProperties
): properties is FieldBlockProperties {
	return 'fieldType' in properties;
}

export interface FieldTypeConfig {
	value: FieldType;
	labelKey: string;
	icon: string;
}

export const FIELD_TYPES: FieldTypeConfig[] = [
	{ value: 'text', labelKey: 'common.template_builder.field_types.text', icon: 'type' },
	{ value: 'email', labelKey: 'common.template_builder.field_types.email', icon: 'mail' },
	{ value: 'number', labelKey: 'common.template_builder.field_types.number', icon: 'hash' },
	{ value: 'tel', labelKey: 'common.template_builder.field_types.phone', icon: 'phone' },
	{
		value: 'textarea',
		labelKey: 'common.template_builder.field_types.textarea',
		icon: 'align-left'
	},
	{ value: 'date', labelKey: 'common.template_builder.field_types.date', icon: 'calendar' },
	{
		value: 'signature',
		labelKey: 'common.template_builder.field_types.signature',
		icon: 'pen-tool'
	}
];

export const ICON_NAME_MAP: Record<string, string> = {
	text: 'Type',
	email: 'Mail',
	number: 'Hash',
	tel: 'Phone',
	textarea: 'AlignLeft',
	date: 'Calendar',
	signature: 'PenTool',
	type: 'Type',
	mail: 'Mail',
	hash: 'Hash',
	phone: 'Phone',
	'align-left': 'AlignLeft',
	calendar: 'Calendar',
	'pen-tool': 'PenTool'
};
