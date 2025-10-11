export interface EditableTextBlocks {
	id: string;
	label: string;
	content: string;
}

export interface Field {
	id: string;
	label: string;
	type: string;
	required?: boolean;
	disabled?: boolean;
}

export interface Layout {
	sections: string[];
}

export interface PdfLayoiutTextSection {
	type: 'text';
	source: string;
	style: Record<string, string | number>;
}

export interface PdfLayoutFieldsSection {
	type: 'fields';
	fields: {
		label: string;
		source: string;
		x: number;
		yOffset: number;
		type: string;
	}[];
}

export interface PdfLayout {
	pageSize: string;
	margins: {
		top: number;
		bottom: number;
		right: number;
		left: number;
	};
	font: {
		family: string;
		size: number;
	};
	sections: PdfLayoiutTextSection | PdfLayoutFieldsSection;
}

export interface FormTemplateSchema {
	version: string;
	direction: CanvasDirection;
	editableTextBlocks: EditableTextBlocks[];
	fields: Field[];
	layout: Layout;
	pdfLayout: PdfLayout;
}
