function findFirst(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  let ans = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (nums[mid] < target) {
      lo = mid + 1; // too small: go right
    } else if (nums[mid] > target) {
      hi = mid - 1; // too big: go left
    } else {
      ans = mid; // match: save it...
      hi = mid - 1; // ...and keep looking LEFT for an earlier one
    }
  }
  return ans;
}

function findLast(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;
  let ans = -1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (nums[mid] < target) {
      lo = mid + 1;
    } else if (nums[mid] > target) {
      hi = mid - 1;
    } else {
      ans = mid;
      lo = mid + 1; // the ONE different line: keep looking RIGHT
    }
  }
  return ans;
}

function searchRange(nums, target) {
  return [findFirst(nums, target), findLast(nums, target)];
}

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const cases = [
  [[5, 7, 7, 8, 8, 10], 8, [3, 4]],
  [[5, 7, 7, 8, 8, 10], 6, [-1, -1]],
  [[], 0, [-1, -1]],
  [[1], 1, [0, 0]],
  [[2, 2, 2, 2], 2, [0, 3]],
  [[1, 2, 3], 1, [0, 0]],
  [[1, 2, 3], 3, [2, 2]],
  [[1, 2, 3], 4, [-1, -1]],
  [[1, 2, 3], 0, [-1, -1]],
];

const t0 = performance.now();
cases.forEach(([nums, target, expected], i) => {
  const got = searchRange(nums, target);
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  console.log(`${pass ? 'PASS' : 'FAIL'} #${i + 1}`, {
    nums,
    target,
    expected,
    got,
  });
});
console.log(`runtime: ${(performance.now() - t0).toFixed(3)} ms`);
