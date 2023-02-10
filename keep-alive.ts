import { Observable, ObservableInput } from 'rxjs';
import { retry } from 'rxjs/operators';

export function keepStreamAlive({
  retries = Infinity,
  notifyStop = () => Promise.resolve(),
  resetOnSuccess = true
}: Partial<{
  retries: number;
  notifyStop: () => ObservableInput<any>;
  resetOnSuccess: boolean;
}> = {}) {
  return (source$: Observable<any>) =>
    new Observable(subscriber =>
      source$.subscribe({
        next: value => subscriber.next(value),
        error: error => subscriber.error(error),
        complete: () => subscriber.error('complete')
      })
    ).pipe(
      retry({
        count: retries,
        delay: notifyStop,
        resetOnSuccess
      })
    );
}
