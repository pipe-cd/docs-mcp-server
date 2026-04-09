#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { version as VERSION } from "../package.json";
import { loadDocsFromGitHub } from "./loader";
import { searchDocs } from "./search";

async function main() {
	const server = new McpServer({
		name: "PipeCDDocsSearch",
		description: "Search PipeCD docs",
		version: VERSION,
	});

	const docsIndexes = await loadDocsFromGitHub();

	server.tool(
		"search_docs",
		"Executes a full-text search on PipeCD docs. Provide space-separated keywords (AND search), a starting offset, and an optional result limit.",
		{
			query: z.string(),
			offset: z.number(),
			limit: z.number().default(20),
		},
		async ({ query, offset, limit }) => {
			const queries = query.toLowerCase().split(" ");
			// 1. prioritize title match
			const results = await searchDocs(docsIndexes, queries, offset, limit);

			if (results.length === 0) {
				return {
					content: [
						{
							type: "text",
							text: `No docs for ${query} found in ${docsIndexes.length} pages.`,
						},
					],
				};
			}

			return {
				content: [{ type: "text", text: JSON.stringify(results) }],
			};
		},
	);
	// NOTE: read_docs might not be called because search_docs contains contents.
	server.tool(
		"read_docs",
		'Returns the full content of a specified PipeCD doc page. Provide the relative path of the document (after "docs/content/en/").',
		{ path: z.string() },
		async ({ path }) => {
			const doc = docsIndexes.find((doc) => doc.path === path);
			return {
				content: [
					{ type: "text", text: doc?.content ?? "document not found" },
				],
			};
		},
	);

	// Start receiving messages on stdin and sending messages on stdout
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main();
