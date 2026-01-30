export default (parameters: { title: string }) => {
	return `
  <div style="background-color: #5ab3a0; padding: clamp(20px, 5vw, 35px) clamp(16px, 4vw, 40px); text-align: center;">
      <h1 style="margin: 0; color: #fcfcfd; font-size: clamp(20px, 4vw, 24px); font-weight: 600; line-height: 1.3;">
      ${parameters.title}
      </h1>
  </div>
  `;
};
