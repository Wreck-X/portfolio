import { error } from '@sveltejs/kit';
import { getPost } from '$lib/server/posts';

export async function load({ params, platform }) {
	if (!platform?.env?.DB) throw error(500, 'Database not available');
	const post = await getPost(platform.env.DB, params.slug);
	if (!post) throw error(404, 'Post not found');
	return { post };
}
