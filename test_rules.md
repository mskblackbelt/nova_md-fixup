# Test Markdown File for Rules 1, 2, and 12

This file tests three specific md-fixup rules:
- Rule 1: Normalize line endings to Unix
- Rule 2: Trim trailing whitespace (preserve exactly 2 spaces)  
- Rule 12: Convert list indentation spaces to tabs

## Trailing Whitespace Test

This line has trailing spaces at the end     
This line also has trailing spaces   
This line has exactly two trailing spaces for a line break  
And this line continues after the break.

## List Indentation Test

Here's a nested list with space-based indentation:

* First level item
* Another first level item
    * Second level with 4 spaces
    * Another second level with 4 spaces
        * Third level with 8 spaces
        * Another third level with 8 spaces
* Back to first level

Mixed indentation list:

- Item one
-   Item two with extra spaces after marker
    - Nested item (4 spaces)
        - Double nested (8 spaces)
    - Another nested
- Back to top

## Combined Test

Line with trailing whitespace and nested list:   

* Parent item has trailing spaces at end    
    * Child item also has trailing spaces    
        * Grandchild with spaces at end     

End of test file.
