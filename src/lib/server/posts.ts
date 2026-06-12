export type Post = {
	slug: string;
	title: string;
	date: string;
	content: string;
};

export function slugify(title: string): string {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.slice(0, 80);
}

export async function listPosts(db: D1Database): Promise<Post[]> {
	const { results } = await db
		.prepare('SELECT slug, title, date, content FROM posts ORDER BY date DESC')
		.all<Post>();
	return results ?? [];
}

export async function getPost(db: D1Database, slug: string): Promise<Post | null> {
	const row = await db
		.prepare('SELECT slug, title, date, content FROM posts WHERE slug = ?')
		.bind(slug)
		.first<Post>();
	return row ?? null;
}

export async function createPost(
	db: D1Database,
	title: string,
	content: string
): Promise<Post> {
	const baseSlug = slugify(title) || 'post';
	let slug = baseSlug;
	let i = 2;
	while (await getPost(db, slug)) {
		slug = `${baseSlug}-${i++}`;
	}
	const post: Post = {
		slug,
		title: title.trim(),
		date: new Date().toISOString(),
		content: content.trim()
	};
	await db
		.prepare('INSERT INTO posts (slug, title, date, content) VALUES (?, ?, ?, ?)')
		.bind(post.slug, post.title, post.date, post.content)
		.run();
	return post;
}
