// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare global {
	interface D1Result<T = unknown> {
		results?: T[];
		success: boolean;
		meta: Record<string, unknown>;
	}

	interface D1PreparedStatement {
		bind(...values: unknown[]): D1PreparedStatement;
		first<T = unknown>(col?: string): Promise<T | null>;
		all<T = unknown>(): Promise<D1Result<T>>;
		run(): Promise<D1Result>;
	}

	interface D1Database {
		prepare(query: string): D1PreparedStatement;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				DB: D1Database;
				BLOG_ADMIN_PASSWORD: string;
			};
		}
	}
}

export {};
