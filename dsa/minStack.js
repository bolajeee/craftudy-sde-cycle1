class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }



push(val) {
  this.stack.push(val);

  if (
    this.minStack.length === 0 ||
    val <= this.minStack.at(-1)
  ) {
    this.minStack.push(val);
  }
}


pop() {
  const removed = this.stack.pop();

  if (removed === this.minStack.at(-1)) {
    this.minStack.pop();
  }

  return removed;
}

top() {
  const lastVal = this.stack.at(-1)
  return lastVal
}

getMin(){
  return this.minStack.at(-1)
}

}

const stack = new MinStack();

stack.push(-2);
stack.push(0);
stack.push(-3);

console.log(stack.getMin()); // -3

stack.pop();

console.log(stack.top());    // 0
console.log(stack.getMin()); // -2
