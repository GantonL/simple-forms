import type { MarkdownToolbarConfig } from '$lib/models/markdown-toolbar';
import { Bold, Italic, Code, Link } from '@lucide/svelte';

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
		}
	]
};
