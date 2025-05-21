# PipeCD Docs MCP Server

A local MCP server for searching official PipeCD docs.

## Overview

This server clones the official [PipeCD](https://github.com/pipe-cd/pipecd) docs from GitHub and provides simple full-text search and document retrieval APIs via the MCP protocol.  
Documentation is cloned into a temporary directory, and Markdown files are indexed by extracting their titles and content.

## Usage

### Cursor

Add the following config to your mcp.json.

```json
{
  "mcpServers": {
    "pipe-cd.docs-mcp-server": { // Any name
      "type": "stdio",
      "command": "npx",
      "args": [
        "@pipe-cd/docs-mcp-server@latest"
      ], 
    }
  }
}
```

## Tools

### search_docs

Executes a full-text search on PipeCD docs.

- Parameters:
  - `query`: Search keywords (space-separated, AND search)
  - `offset`: Start position for results
  - `limit`: Number of results to return (default: 20)

### read_docs

Returns the content of the specified page.

- Parameters:
  - `path`: Relative path of the document (after "docs/content/en/")

## Implementation Notes

- Uses sparse-checkout to minimize clone size and speed up the process.
- Titles are extracted from the Markdown front matter.
- The search logic of `search_docs` is so simple for now.


## Contributing

### Code of Conduct

PipeCD follows the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). Please read it to understand which actions are acceptable and which are not.

### Get Involved

- Slack: `#pipecd` channel on [CNCF Slack](https://cloud-native.slack.com/) for discussions related to PipeCD development.
- Community Meeting: Every other Wednesdays. Search [here](https://www.cncf.io/calendar/).

### Improvements

- Bug: 
  - Please open an Issue and describe the problem. Or, open a PR with if it's easy one.
- Enhancement / Feature Request:
  - For small changes including typos or docs, please open a PR.
  - For new features or big enhancement, basically, please open an Issue and discuss there before sending a PR. We cannot accept all requests in some cases.
- Security issue:
  - Send an email to [the core maintainers](https://github.com/pipe-cd/pipecd/blob/master/SECURITY.md). **DO NOT report on Issues.**
