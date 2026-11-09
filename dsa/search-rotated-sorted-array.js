const search = (nums, target) => {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (nums[mid] === target) return mid;

    // OUTER if: which half is sorted?
    if (nums[lo] <= nums[mid]) {
      // Left half [lo..mid] is sorted.
      // INNER if: is the target inside that sorted range?
      if (nums[lo] <= target && target < nums[mid]) {
        hi = mid - 1; // yes → keep left, drop right
      } else {
        lo = mid + 1; // no → it can only be on the right
      }
    } else {
      // Right half [mid..hi] is sorted.
      if (nums[mid] < target && target <= nums[hi]) {
        lo = mid + 1; // yes → keep right, drop left
      } else {
        hi = mid - 1; // no → it can only be on the left
      }
    }
  }
  return -1;
};

const cases = [
  [[4, 5, 6, 7, 0, 1, 2], 0, 4],
  [[4, 5, 6, 7, 0, 1, 2], 3, -1],
  [[1], 0, -1],
  [[3, 1], 1, 1],
];

for (const [nums, target, expected] of cases) {
  const got = search(nums, target);
  console.log(got === expected ? 'pass' : 'FAIL', {
    nums,
    target,
    expected,
    got,
  });
}
