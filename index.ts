import { interval, Observable, ObservableInput, Subject, takeUntil, takeWhile } from 'rxjs';
import { keepStreamAlive } from './keep-alive';

let taking: number | null = null;
let disconnectNow$ = new Subject<void>();

const RECONNECT_STRATEGY: 'IMMEDIATE' | 'OPTIMIZE' = 'IMMEDIATE';
const RECONNECT_DELAY = 2000;

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

// We are just putting a dummy logic to allow
// the stream to disconnect after 1 minute of
// keeping it alive.
//
// This is just simulation logic to decide
// when the stream can disconnect. The actual
// business scenario of when the stream can
// be allowed to disconnect will be different.
let isItTimeToStopKeepingAlive = false;
setTimeout(function timeExpired() {
  console.log('Stop keeping alive now.');
  isItTimeToStopKeepingAlive = true;

  // Mechanism to force immediate disconnection
  disconnectNow$.next();
  disconnectNow$.complete();
}, 60000);

function notifyStop(): ObservableInput<any> {
  return new Observable(observer => {
    // Here we must implement logic to decide if the stream must be
    // kept alive, or if it can be allowed to disconnect.
    //
    // Here we are using the isItTimeToStopKeepingAlive flag to
    // decide. Actual logic can be different.

    if (isItTimeToStopKeepingAlive) {
      // If the stream can be allowed to disconnect, then complete the observer
      console.log('Stream can now be disconnected. Stop keeping it alive.');
      observer.complete();
    } else {
      // If the stream must be kept alive, send an empty value on observer.next()
      console.log('Stream seems to have disconnected. Keep it alive...');

      if (RECONNECT_STRATEGY === 'IMMEDIATE') {
        observer.next();
      } else {
        setTimeout(() => observer.next(), RECONNECT_DELAY);
      }
    }
  });
}

interval(1000)
  .pipe(takeWhile(takeMore), takeUntil(disconnectNow$), keepStreamAlive({ notifyStop }))
  .subscribe({
    next: console.log,
    error: console.error,
    complete: () => console.log('Stream completed. Will not try to reconnect.')
  });

// Open the console in the bottom right to see results.
