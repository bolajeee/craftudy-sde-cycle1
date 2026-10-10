
const groupAnagrams = (words) => {

const groups = new Map()

for(i = 0; i < words.length; i++){

const key = words[i].split("").sort().join("");

if (!groups.has(key)) {
  groups.set(key, []);
}

groups.get(key).push(words[i]);

 }

  return Array.from(groups.values());
}


console.log(
  groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"])
);

//time complexity O(nklogk)
//space complexity O(nk)
