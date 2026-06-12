import { error, fail, redirect } from '@sveltejs/kit';
import { createPost } from '$lib/server/posts';

export const actions = {
	default: async ({ request, platform }) => {
		if (!platform?.env?.DB) throw error(500, 'Database not available');

		const form = await request.formData();
		const password = String(form.get('password') ?? '');
		const title = String(form.get('title') ?? '').trim();
		const content = String(form.get('content') ?? '').trim();

		const expected = platform.env.BLOG_ADMIN_PASSWORD;
		if (!expected || password !== expected) {
			return fail(401, { error: 'Wrong password.', title, content });
		}
		if (!title) return fail(400, { error: 'Title required.', title, content });
		if (!content) return fail(400, { error: 'Content required.', title, content });

		const post = await createPost(platform.env.DB, title, content);
		throw redirect(303, `/blog/${post.slug}`);
	}
};
