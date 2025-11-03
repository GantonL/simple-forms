import type { MarkdownToolbarConfig } from '$lib/models/markdown-toolbar';
import { Bold, Italic, Code, Link, AlignCenter, List, ListOrdered, Heading, Underline, Highlighter } from '@lucide/svelte';

const applyBold = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		// Wrap selected text
		const newValue = `${before}**${selectedText}**${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 2, end + 2);
	} else {
		// No selection - insert placeholder
		const newValue = `${before}****${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 2, start + 2);
	}

	// Trigger input event for reactivity
	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyItalic = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}_${selectedText}_${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 1, end + 1);
	} else {
		const newValue = `${before}__${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 1, start + 1);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyUnderline = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}<u>${selectedText}</u>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 3, end + 3);
	} else {
		const newValue = `${before}<u></u>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 3, start + 3);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyCode = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}\`${selectedText}\`${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 1, end + 1);
	} else {
		const newValue = `${before}\`\`${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 1, start + 1);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyLink = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}[${selectedText}](url)${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + selectedText.length + 3, start + selectedText.length + 6);
	} else {
		const newValue = `${before}[text](url)${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 1, start + 5);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyCenter = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}<center>${selectedText}</center>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 8, end + 8);
	} else {
		const newValue = `${before}<center></center>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 8, start + 8);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyBulletList = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const text = textarea.value;

	// Find line boundaries
	const lineStart = text.lastIndexOf('\n', start - 1) + 1;
	const lineEnd = text.indexOf('\n', end);
	const actualEnd = lineEnd === -1 ? text.length : lineEnd;

	const before = text.substring(0, lineStart);
	const selectedText = text.substring(lineStart, actualEnd);
	const after = text.substring(actualEnd);

	const lines = selectedText.split('\n');
	const allHaveBullets = lines.every(line => line.startsWith('- '));

	let newLines: string[];
	if (allHaveBullets) {
		// Remove bullets
		newLines = lines.map(line => line.substring(2));
	} else {
		// Add bullets
		newLines = lines.map(line => line.startsWith('- ') ? line : `- ${line}`);
	}

	const newSelectedText = newLines.join('\n');
	textarea.value = before + newSelectedText + after;
	textarea.setSelectionRange(lineStart, lineStart + newSelectedText.length);

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyNumberedList = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const text = textarea.value;

	// Find line boundaries
	const lineStart = text.lastIndexOf('\n', start - 1) + 1;
	const lineEnd = text.indexOf('\n', end);
	const actualEnd = lineEnd === -1 ? text.length : lineEnd;

	const before = text.substring(0, lineStart);
	const selectedText = text.substring(lineStart, actualEnd);
	const after = text.substring(actualEnd);

	const lines = selectedText.split('\n');
	const allHaveNumbers = lines.every(line => /^\d+\.\s/.test(line));

	let newLines: string[];
	if (allHaveNumbers) {
		// Remove numbers
		newLines = lines.map(line => line.replace(/^\d+\.\s/, ''));
	} else {
		// Add numbers
		newLines = lines.map(line => /^\d+\.\s/.test(line) ? line : `1. ${line}`);
	}

	const newSelectedText = newLines.join('\n');
	textarea.value = before + newSelectedText + after;
	textarea.setSelectionRange(lineStart, lineStart + newSelectedText.length);

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyHeading = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const text = textarea.value;

	// Find line boundaries
	const lineStart = text.lastIndexOf('\n', start - 1) + 1;
	const lineEnd = text.indexOf('\n', end);
	const actualEnd = lineEnd === -1 ? text.length : lineEnd;

	const before = text.substring(0, lineStart);
	const selectedText = text.substring(lineStart, actualEnd);
	const after = text.substring(actualEnd);

	const lines = selectedText.split('\n');
	const newLines = lines.map(line => {
		const match = line.match(/^(#{1,6})\s/);
		if (match) {
			const level = match[1].length;
			if (level >= 6) {
				// Remove heading
				return line.replace(/^#{6}\s/, '');
			}
			// Increment level
			return line.replace(/^#{1,6}\s/, '#'.repeat(level + 1) + ' ');
		}
		// Add level 1 heading
		return `# ${line}`;
	});

	const newSelectedText = newLines.join('\n');
	textarea.value = before + newSelectedText + after;
	textarea.setSelectionRange(lineStart, lineStart + newSelectedText.length);

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

const applyHighlight = (textarea: HTMLTextAreaElement) => {
	const start = textarea.selectionStart;
	const end = textarea.selectionEnd;
	const selectedText = textarea.value.substring(start, end);
	const before = textarea.value.substring(0, start);
	const after = textarea.value.substring(end);

	if (selectedText) {
		const newValue = `${before}<mark>${selectedText}</mark>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 6, end + 6);
	} else {
		const newValue = `${before}<mark></mark>${after}`;
		textarea.value = newValue;
		textarea.setSelectionRange(start + 6, start + 6);
	}

	textarea.dispatchEvent(new Event('input', { bubbles: true }));
	textarea.focus();
};

export const MarkdownToolbarConfiguration: MarkdownToolbarConfig = {
	items: [
		{
			id: 'bold',
			label: 'common.bold',
			icon: Bold,
			action: applyBold
		},
		{
			id: 'italic',
			label: 'common.italic',
			icon: Italic,
			action: applyItalic
		},
		{
			id: 'underline',
			label: 'common.underline',
			icon: Underline,
			action: applyUnderline
		},
		{
			id: 'code',
			label: 'common.code',
			icon: Code,
			action: applyCode
		},
		{
			id: 'link',
			label: 'common.link',
			icon: Link,
			action: applyLink
		},
		{
			id: 'center',
			label: 'common.center',
			icon: AlignCenter,
			action: applyCenter
		},
		{
			id: 'bullet-list',
			label: 'common.bulletList',
			icon: List,
			action: applyBulletList
		},
		{
			id: 'numbered-list',
			label: 'common.numberedList',
			icon: ListOrdered,
			action: applyNumberedList
		},
		{
			id: 'heading',
			label: 'common.heading',
			icon: Heading,
			action: applyHeading
		},
		{
			id: 'highlight',
			label: 'common.highlight',
			icon: Highlighter,
			action: applyHighlight
		}
	]
};
