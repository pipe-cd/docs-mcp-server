import { extractTitleFromFrontMatter } from './loader';

describe('extractTitleFromFrontMatter', () => {
    it('should extract title from front matter', () => {
        const content = `---
title: "Hello World"
---

Content here`;
        expect(extractTitleFromFrontMatter(content)).toBe('Hello World');
    });

    it('should return empty string when no title is found', () => {
        const content = `---
description: "No title here"
---

Content here`;
        expect(extractTitleFromFrontMatter(content)).toBe('');
    });

    it('should handle title with special characters', () => {
        const content = `---
title: "Hello & World: Special Characters!"
---

Content here`;
        expect(extractTitleFromFrontMatter(content)).toBe('Hello & World: Special Characters!');
    });

    it('should handle empty content', () => {
        expect(extractTitleFromFrontMatter('')).toBe('');
    });

    it('should handle content without front matter', () => {
        const content = 'Just some content without front matter';
        expect(extractTitleFromFrontMatter(content)).toBe('');
    });
}); 