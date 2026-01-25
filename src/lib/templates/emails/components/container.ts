export default (content: string) => {
	return `
  <div style="background-color: #f7f8f9; padding: 20px 10px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fcfcfd; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">
        ${content}
      </div>
  </div>
  `;
};
