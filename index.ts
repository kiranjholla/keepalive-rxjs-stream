import { interval, Observable, takeWhile } from 'rxjs';
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
    keepStreamAlive({
      notifyStop: () =>
        new Observable(observer => {
          console.log('Stream seems to have disconnected. Keep it alive...');
          setTimeout(() => observer.next(), 2000);
        })
    })
  )
  .subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log('Stream completed. Will not try to reconnect.')
  });

// Open the console in the bottom right to see results.
