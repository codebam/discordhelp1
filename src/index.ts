import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const ai = new Ai(env.AI);

		let htmlForm = `
        <h1>Enter a question below:</h1>
        <form action="/" method="post">
        <textarea name="text" rows="5" cols="50"></textarea><br>
        <br><button type="submit">Post Question</button><br><br>`;

		if (request.method === 'POST') {
			const formData = await request.formData();
			const text = formData.get('text');
			const chat = {
				messages: [
					{
						role: 'user',
						content: text ?? 'hello',
					},
				],
			};

			const { response } = await ai.run('@hf/thebloke/llama-2-13b-chat-awq', chat);
			return new Response(htmlForm + '<BR><BR>The response is:<BR>' + response, { headers: { 'Content-Type': 'text/html' } });
		} else {
			return new Response(htmlForm, { headers: { 'Content-Type': 'text/html' } });
		}
	},
};
