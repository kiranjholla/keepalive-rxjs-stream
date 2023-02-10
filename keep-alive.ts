import { Subscriber } from 'rxjs';

import { Subscriber } from 'rxjs';

export class KeepStreamAliveSubscriber<T> extends Subscriber<T> {
  constructor(subscriber: Subscriber<T>) {
    super(subscriber);
  }
}
