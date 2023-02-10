import { interval, takeWhile } from 'rxjs';
import { keepStreamAlive } from './keep-alive';

let taking: number = 1;

function howManyToTake(): number {
  let innerCount: number = Math.floor(Math.random() * 5);
  console.log('Taking: ', innerCount);
  return innerCount;
}

function takeMore(x: number): boolean {
  if (x > taking) {
    taking = howManyToTake();
    return false;
  }
  return true;
}

interval(1000)
  .pipe(
    takeWhile(takeMore),
    keepStreamAlive()
  )
  .subscribe(console.log);

// Open the console in the bottom right to see results.
