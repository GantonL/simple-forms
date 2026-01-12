export const copyToClipboard = (text: string): Promise<void> => {
	return new Promise((resolve, reject) => {
		navigator.clipboard
			.writeText(text)
			.then(resolve)
			.catch(() => {
				try {
					fallbackCopyTextToClipboard(text);
					resolve();
				} catch {
					reject();
				}
			});
	});
};

const fallbackCopyTextToClipboard = (text: string) => {
	const textArea = document.createElement('temp-copy-textarea');
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	document.execCommand('copy');
	document.body.removeChild(textArea);
};
