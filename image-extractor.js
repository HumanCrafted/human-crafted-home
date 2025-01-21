function extractImagePaths(markdownContent) {
  console.log(`Extracting image paths from: "${markdownContent}"`);
  // Updated regex to handle various quoting scenarios and be more flexible
  const regex = /!\[(?:.*?)\]$$([^)]+)$$/g;

  const matches = [];
  let match;
  while ((match = regex.exec(markdownContent)) !== null) {
    console.log(`Found match: ${match[0]}, Extracted path: ${match[1]}`);
    matches.push(match[1]);
  }

  console.log(`Extracted ${matches.length} image paths`);
  return matches;
}

function removeImageSyntax(str) {
  if (typeof str !== 'string') {
    console.log(`Input is not a string: ${typeof str}`);
    return str;
  }
  
  console.log(`\nProcessing string: "${str}"`);
  
  // Remove surrounding quotes if present
  str = str.replace(/^['"](.*)['"]$/, '$1');
  
  const paths = extractImagePaths(str);
  if (paths.length > 0) {
    console.log(`Extracted image path: "${paths[0]}"`);
    return paths[0];
  } else {
    console.log("No image syntax found");
    return str;
  }
}

// Test with sample strings
const testStrings = [
  "'![](images/test.svg)'",
  '![](images/test.svg)',
  'normal string',
  "'normal string'",
  '"![](images/test.svg)"',
  '![Alt text](images/test.svg)',
  '"![Alt text](images/test.svg)"'
];

console.log("Testing sample strings:");
testStrings.forEach(str => {
  console.log(`\nInput: ${str}`);
  console.log(`Output: ${removeImageSyntax(str)}`);
});

// Test with actual markdown content
const markdownContent = `
# Test Markdown

Here's an image: ![](images/example.png)

And another one: ![Alt text](images/another-example.jpg)

This is a normal paragraph.

## More content

![](images/third-example.svg)
`;

console.log("\nTesting with markdown content:");
const extractedPaths = extractImagePaths(markdownContent);
console.log("Extracted paths:", extractedPaths);

// Additional debugging
console.log("\nRegex test:");
const testRegex = /!\[(?:.*?)\]$$([^)]+)$$/g;
testStrings.forEach(str => {
  console.log(`\nTesting: ${str}`);
  const matches = str.match(testRegex);
  console.log(`Matches: ${JSON.stringify(matches)}`);
});