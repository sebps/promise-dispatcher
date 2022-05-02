# PromiseDispatcher

promise-dispatcher
==========

A lightweight library to manage promises according to settings such as processing order, time interval and rate per time interval. 

<!-- TOC -->
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [License](#license)
<!-- /TOC -->

## Features
- Promise processing mode - management of the promises execution order ( FIFO queue or LIFO stack ) 
- Time Interval - time interval used to calculate promise execution rate ( default to 1 second )  
- Rate execution -  management of the promise execution rate ( max promise per time interval )

## Installation

```sh
$ npm install promise-dispatcher
```

## Usage

### Loading the module
```js
const PromiseDispatcher = require('promise-dispatcher');
```

### Creating a new promise dispatcher instance
```js
const promiseDispatcher = new PromiseDispatcher(tasks, mode = "QUEUE", rate = 1, interval = 1000)
```

### Register a new promise
To register a new promise in a promise dispatcher instance, it must be wrapped into a provider function that return the promise so that it can be executed whenever necessary by the promise dispatcher

```js
const promiseProvider = function() { 
    return new Promise((resolve,reject) => {
        // do stuff
        resolve()
    })
}

promiseDispatcher.registerPromise(promiseProvider)
```

### startExecution
A promise dispatcher instance starts to process promises once its startExecution method is called

```js
promiseDispatcher.startExecution()
```

### stopExecution
A promise dispatcher instance stops to process promises once its stopExecution method is called

```js
promiseDispatcher.stopExecution()
```

## Examples

```js
const rate = 5 // promise rate per time interval
const interval = 1000 // time interval in ms
const promiseProviders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(value) {
    return function () {
        return new Promise((resolve, reject) => {
            console.log(value)
        });
    };
});
```

### Queue mode
```js
(async function() {
  const promiseDispatcher = promiseDispatcher.new("QUEUE", rate, interval)
  promiseDispatcher.startExecution()
  promiseDispatcher.registerPromises(promiseProviders)
  // expected console logs :
  // after 0 second : 1,2,3,4,5
  // after 1 second : 6,7,8,9,10
  promiseDispatcher.stopExecution()
})();
```

### Stack mode
```js
(async function() {
    const promiseDispatcher = promiseDispatcher.new("STACK", rate, interval)
    promiseDispatcher.startExecution()
    promiseDispatcher.registerPromises(tasks)
    // expected console logs :
    // after 0 second : 10,9,8,7,6
    // after 1 second : 5,4,3,2,1
    promiseDispatcher.stopExecution()
})();
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-dispatcher
