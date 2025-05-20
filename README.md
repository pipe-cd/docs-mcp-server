# PipeCD Docs MCP Server

A local MCP server for searching official PipeCD docs.

## Overview

This server clones the official [PipeCD](https://github.com/pipe-cd/pipecd) docs from GitHub and provides simple full-text search and document retrieval APIs via the MCP protocol.  
Documentation is cloned into a temporary directory, and Markdown files are indexed by extracting their titles and content.

## Usage

### 1. Install

```bash
git clone https://github.com/pipe-cd/docs-mcp-server.git
cd docs-mcp-server
npm install
```

### 2. Build

```bash
npm run build
```

### 3. Start the server

```bash
npm start
```

For development mode (run with TypeScript directly):
```bash
npm run dev
```

### 4. Call from a client

#### Cursor

Add the following config to your mcp.json.

```json
{
  "mcpServers": {
    "pipe-cd.docs-mcp-server": { // Any name
      "type": "stdio",
      "command": "npm",
      "args": [
        "start", "--prefix", "/path/to/docs-mcp-server/"
      ], 
    }
  }
}
```

## API Specification

### search_docs

Performs a full-text search on PipeCD documentation.

- Parameters:
  - `query`: Search keywords (space-separated, AND search)
  - `offset`: Start position for results
  - `limit`: Number of results to return (default: 20)

### read_docs

Returns the content of a specified document.

- Parameters:
  - `path`: Relative path of the document (after "docs/content/en/")

## Implementation Notes

- Uses sparse-checkout to minimize clone size and speed up the process.
- Titles are extracted from the Markdown front matter.
- The search logic of `search_docs` is so simple for now.


## Contributing

TBD