function twoSum(nums, target) {
  const seen = new Map()

  for(let i = 0; i < nums.length; i++){
    const current = nums[i]
    const needed = target - current

    if(seen.has(needed)){
      return [seen.get(needed), i]
   }

  seen.set(current, i)
  }
}

console.log(twoSum([4, 6, 2], 8)); // Expected: [1, 2]


// time complexity O(n)
// space complexity O(n)
