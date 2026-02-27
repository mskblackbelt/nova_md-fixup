# Test Markdown File

This is a test file with some formatting issues that md-fixup should fix.


## Section with  Extra   Spaces

This paragraph has inconsistent spacing and should be wrapped at the configured width. It's intentionally a very long line that goes on and on and should be wrapped by md-fixup when the formatter runs.

Here's a list with inconsistent spacing:

* Item one
*  Item two with extra space
   * Nested item with spaces instead of tabs

## Code Block

Missing blank line before this code block:
```javascript
const x = 42;
```
And missing blank line after it.

## Links and Emphasis

This has _italic_ and __bold__ text that can be normalized.

Here's a link: [Example](https://example.com)

---

Horizontal rule above should have proper spacing.
