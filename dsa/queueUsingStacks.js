class QueueUsingStacks{
  constructor(){
    this.inputStack = [];
    this.outputStack = [];
 }

enqueue(val){
  this.inputStack.push(val)
}

transferIfNeeded(){
  if(this.outputStack.length === 0){
    while(this.inputStack.length > 0){
      this.outputStack.push(this.inputStack.pop());
  }
 }
}

dequeue(){
  this.transferIfNeeded();

  if(this.outputStack.length === 0){
    return undefined;
  }

  return this.outputStack.pop();
}

peek() {
    this.transferIfNeeded();

    if (this.outputStack.length === 0) {
      return undefined;
    }

    return this.outputStack.at(-1);
  }

}

const queue = new QueueUsingStacks();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(queue.dequeue()); // 10
console.log(queue.dequeue()); // 20
console.log(queue.dequeue()); // 30

const queue2 = new QueueUsingStacks();

queue2.enqueue(10);
queue2.enqueue(20);

console.log(queue2.dequeue()); // 10

queue2.enqueue(30);

console.log(queue2.dequeue()); // 20
console.log(queue2.dequeue()); // 30
