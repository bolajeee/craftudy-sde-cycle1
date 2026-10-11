function reverseWords(str) {
  const trimmedWords = str.trim().split(/\s+/);
  const reversedWords = trimmedWords.reverse();
  return reversedWords.join(" ");
}

console.log(reverseWords("the sky is blue"));
// "blue is sky the"

console.log(reverseWords("  hello   world  "));
// "world hello"

console.log(reverseWords("one"));
// "one"
