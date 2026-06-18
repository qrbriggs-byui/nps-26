# Wolves in Yellowstone SEO Audit — Answer Key

## Checklist Results

- **Does the page have one clear purpose?**  
  ✅ Mostly yes (informing visitors/students about wolves in Yellowstone).

- **Is the content useful for a real audience?**  
  ✅ Yes.

- **Is there a unique `<title>`?**  
  ❌ No. `<title>National Parks</title>` is too generic.

- **Is there a helpful meta description?**  
  ❌ No meta description present.

- **Is there one clear `<h1>`?**  
  ❌ No. There are two `<h1>` elements.

- **Are headings in a logical order?**  
  ❌ No. A `<h3>` appears before a `<h2>`.

- **Are important links real `<a href="...">` links?**  
  ❌ No. One important link is a clickable `<span>` with `onclick`.

- **Do images have useful file names and `alt` text?**  
  ❌ Not all. One image is `ABC123.jpg` with empty `alt`.

- **Are Open Graph tags included?**  
  ✅ Yes.

- **Are Twitter Card tags included when needed?**  
  ❌ No Twitter card tags included.

- **Can the main content be seen without waiting for a lot of JavaScript?**  
  ✅ Yes (content is in HTML), though there is a blocking external script.

- **Does the page work well on mobile?**  
  ❌ Missing viewport meta tag.

- **Does the page load quickly?**  
  ⚠️ Potential issue: unnecessary render-blocking lodash script in `<head>`.

## Suggested Fix Priorities (optional for students)

1. Add viewport + meta description.
2. Use one `<h1>` and fix heading hierarchy.
3. Replace fake link `<span>` with real `<a href>`.
4. Improve title specificity.
5. Fix image filename/alt text.
6. Add Twitter card tags.
7. Remove or defer nonessential blocking JS.