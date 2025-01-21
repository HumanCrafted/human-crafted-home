function extractImagePaths(input) {
  console.log(`\nInput: ${JSON.stringify(input)}`);
  console.log(`Type: ${typeof input}`);
  console.log(`Length: ${input.length}`);
  
  if (typeof input !== 'string') {
    console.log('Input is not a string, returning empty array');
    return [];
  }

  // Correct regex pattern for markdown image syntax
  const regex = /!\[.*?\]$$(.*?)$$/g;
  console.log(`Regex pattern: ${regex}`);

  const matches = [];
  let match;

  try {
    while ((match = regex.exec(input)) !== null) {
      console.log(`Found match: ${JSON.stringify(match)}`);
      matches.push(match[1]); // Extracting the path inside parentheses
    }
  } catch (error) {
    console.error(`Error during regex execution: ${error}`);
  }

  console.log(`Extracted ${matches.length} image paths`);
  return matches;
}

function removeImageSyntax(str) {
  if (typeof str !== 'string') {
    console.log(`Input is not a string: ${typeof str}`);
    return str;
  }
  
  console.log(`\nProcessing string: ${JSON.stringify(str)}`);
  
  // Remove surrounding quotes if present
  str = str.replace(/^['"](.*)['"]$/, '$1');
  
  const paths = extractImagePaths(str);
  if (paths.length > 0) {
    console.log(`Extracted image path: "${paths[0]}"`);
    return paths[0]; // Return the first matched path
  } else {
    console.log("No image syntax found");
    return str;
  }
}

// Test cases
const testStrings = [
  "'![](images/test.svg)'",
  '![](images/test.svg)',
  'normal string',
  "'normal string'",
  '"![](images/test.svg)"',
  '![Alt text](images/test.svg)',
  '"![Alt text](images/test.svg)"',
  '![](images/test.svg)\n![](images/another.png)'
];

console.log("Testing sample strings:");
testStrings.forEach(str => {
  console.log(`\nInput: ${JSON.stringify(str)}`);
  console.log(`Output: ${JSON.stringify(removeImageSyntax(str))}`);
});

// Test with markdown content
const markdownContent = `
# Test Markdown

Here's an image: ![](images/example.png)

And another one: ![Alt text](images/another-example.jpg)

This is a normal paragraph.

## More content

![](images/third-example.svg)
`;

console.log("\nTesting with markdown content:");
const markdownResult = extractImagePaths(markdownContent);
console.log(`Markdown result: ${JSON.stringify(markdownResult)}`);