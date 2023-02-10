import { interval, takeWhile } from 'rxjs';
import { keepStreamAlive } from './keep-alive';

let taking: number | null = null;

function howManyToTake(): number {
  let innerCount: number = Math.floor(Math.random() * 10);
  console.log(`Taking till ${innerCount} before simulating disconnection`);
  return innerCount;
}

function takeMore(x: number): boolean {
  if (taking == null) taking = howManyToTake();

  if (x > taking) {
    taking = null;
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
