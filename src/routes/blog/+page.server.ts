import { error } from '@sveltejs/kit';
import { listPosts } from '$lib/server/posts';

export async function load({ platform }) {
	if (!platform?.env?.DB) throw error(500, 'Database not available');
	const posts = await listPosts(platform.env.DB);
	return { posts };
}
