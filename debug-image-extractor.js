function debugExtractImagePaths(input) {
  console.log(`\nInput: ${JSON.stringify(input)}`);
  console.log(`Type: ${typeof input}`);
  console.log(`Length: ${input.length}`);
  console.log(`Character codes: ${Array.from(input).map(c => c.charCodeAt(0).toString(16)).join(', ')}`);

  if (typeof input !== 'string') {
    console.log('Input is not a string, returning empty array');
    return [];
  }

  const regex = /!\[.*?\]$$(.*?)$$/g;
  console.log(`Regex pattern: ${regex}`);

  const matches = [];
  let match;

  try {
    while ((match = regex.exec(input)) !== null) {
      console.log(`Found match: ${JSON.stringify(match)}`);
      matches.push(match[1]);
    }
  } catch (error) {
    console.error(`Error during regex execution: ${error}`);
  }

  console.log(`Extracted ${matches.length} image paths`);
  return matches;
}

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
  const result = debugExtractImagePaths(str);
  console.log(`Result: ${JSON.stringify(result)}\n`);
});

const markdownContent = `
# Test Markdown

Here's an image: ![](images/example.png)

And another one: ![Alt text](images/another-example.jpg)

This is a normal paragraph.

## More content

![](images/third-example.svg)
`;

console.log("Testing with markdown content:");
const markdownResult = debugExtractImagePaths(markdownContent);
console.log(`Markdown result: ${JSON.stringify(markdownResult)}`);