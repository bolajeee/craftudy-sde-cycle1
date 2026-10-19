function isPalindrome(str) {
  const cleaned = str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }

    left++;
    right--;
  }

  return true;
}


console.log(isPalindrome("racecar"));
console.log(isPalindrome("Race car!"));
console.log(isPalindrome("hello"));
console.log(isPalindrome("No lemon, no melon"));
