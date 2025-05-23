import type { DocFile } from "./types";

export async function searchDocs(
	docsIndexes: DocFile[],
	queries: string[],
	offset: number,
	limit: number,
): Promise<DocFile[]> {
	// 1. prioritize title match
	const result = docsIndexes
		.filter((doc) => queries.some((query) => doc.title.includes(query)))
		.slice(offset, offset + limit);
	if (result.length >= limit) {
		return result;
	}

	// 2. if title match was not enough, then content match
	const byContent = docsIndexes
		.filter((doc) => queries.some((query) => doc.content.includes(query)))
		.slice(offset, offset + (limit - result.length));
	result.push(...byContent);

	return result;
}
