/**
 * Binary Search (W6)
 * Date: 2026-11-02 | Time taken: __ min
 *
 * Approach:
 * The array is sorted, so check the middle element.
 * If it's the target, return its index. If it's too small, the answer
 * must be to the right, so move lo to mid + 1. If it's too big, move
 * hi to mid - 1. Stop when lo crosses hi, which means it isn't there.
 *
 * Complexity: O(log n) time, O(1) space
 */

function binarySearch(nums, target) {
  let lo = 0;
  let hi = nums.length - 1;

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }

  return -1;
}

const nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(binarySearch(nums, 23));  // 5
console.log(binarySearch(nums, 72));  // 8
console.log(binarySearch(nums, 4));   // -1
console.log(binarySearch(nums, 91));  // 9
console.log(binarySearch(nums, 100)); // -1
console.log(binarySearch([], 5));     // -1 (empty array)
