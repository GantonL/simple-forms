import type { MarkdownToolbarConfig } from '$lib/models/markdown-toolbar';
import { Bold } from '@lucide/svelte';

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

export const MarkdownToolbarConfiguration: MarkdownToolbarConfig = {
	items: [
		{
			id: 'bold',
			label: 'common.bold',
			icon: Bold,
			action: applyBold
		}
	]
};
