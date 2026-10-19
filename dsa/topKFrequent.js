function topKfrequent(nums, k){

// get frequency map
const countFrequencies = (nums) => {
  const numGroup = new Map();


  for (let i = 0; i < nums.length; i++) {
   //get count of occuring nums
   const count = numGroup.has(nums[i]) ? numGroup.get(nums[i]) : 0; 

   //return group and count
   numGroup.set(nums[i], count + 1)
  }

  // Return the completed Map
  return numGroup
}

// convert freq map to array
const resultArr = [...countFrequencies(nums)]

// soft result by highest freq
resultArr.sort(( a, b) => b[1] - a[1])

//return arr of only the values
const topK = resultArr.slice(0 , k)

const result = topK.map(entry => entry[0])

return result
}

console.log(topKfrequent([1, 1, 1, 2, 2, 3], 2));

// Top K Frequent Elements (Map + sorting)
// time complexity = O(n + mlog m)
// Spece complxity = O(m)
