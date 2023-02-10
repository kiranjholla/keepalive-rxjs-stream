# keepalive-rxjs-stream
Just an illustration of how an RxJS stream can be kept alive using the `retry` operator provided by `rxjs`.

This repository includes a `keepStreamAlive()` operator which internally makes use of the `retry` operator to reconnect to a stream if it disconnects for any reason.
