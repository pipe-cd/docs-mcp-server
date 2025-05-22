import * as fs from 'fs';
import { glob } from "glob";
import * as os from 'os';
import * as path from 'path';
import simpleGit from 'simple-git';

interface DocFile {
    path: string;
    title: string;
    content: string;
    // version: string; // TODO: Add if possible and effective.
}

const REPO = "https://github.com/pipe-cd/pipecd";
const BRANCH = "master";
const DOCS_PATH = "docs/content/en";
const MARKDOWN_GLOB_PATTERN = '**/*.{md,markdown}';

// Clone the repo to a tmp file and read docs files.
export async function loadDocsFromGitHub(): Promise<DocFile[]> {
    const git = simpleGit();
    const targetDir = path.join(os.tmpdir(), 'pipecd-docs-local-mcp-server');

    try {
        // delete the targetDir if it already exists
        if (fs.existsSync(targetDir)) {
            await fs.promises.rm(targetDir, { recursive: true, force: false });
        }
    } catch (error) {
        console.error(`Error while deleting targetDir ${targetDir}: ${error}`);
    }

    try {
        console.info(`Start cloning repo ${REPO} to ${targetDir}`)
        await git.clone(REPO, targetDir, ['--depth', '1', '--branch', BRANCH, '--sparse', '--filter=blob:none']);
        await git.cwd(targetDir);
        await git.raw(['sparse-checkout', 'set', DOCS_PATH]);
        console.info(`Successfully cloned repo ${REPO} to ${targetDir}`)
    } catch (error) {
        console.error(`Error while cloning repo ${REPO} to ${targetDir}: ${error}`);
        throw error;
    }

    const docsParent = path.join(targetDir, DOCS_PATH);
    const relativePaths = await glob(MARKDOWN_GLOB_PATTERN, { cwd: docsParent });

    if (relativePaths.length === 0) {
        console.error(`No Markdown files found in ${docsParent}.`);
        return [];
    }

    const docFiles: DocFile[] = [];
    for (const relativePath of relativePaths) {
        const absPath = path.join(docsParent, relativePath);
        try {
            const content = await fs.promises.readFile(absPath, 'utf-8');
            const title = extractTitleFromFrontMatter(String(content));
            docFiles.push({
                path: relativePath,
                title: title.toLowerCase(),
                content: String(content),
            });
        } catch (error) {
            console.error(`Error reading file ${absPath}: ${error}`);
            return docFiles;
        }
    }

    return docFiles;
}

export function extractTitleFromFrontMatter(content: string): string {
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    return titleMatch ? titleMatch[1] : '';
}