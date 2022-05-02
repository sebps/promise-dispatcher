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
- Promise processing mode - management of the promises dispatching order ( FIFO queue or LIFO stack ) 
- Time Interval - time interval used to calculate promise dispatching rate ( default to 1 second )  
- Rate dispatching -  management of the promise dispatching rate ( max promise per time interval )

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

### Dispatch a new promise
To dispatch a new promise in a promise dispatcher instance, it must be wrapped into a provider function that return the promise so that it can be executed whenever necessary by the promise dispatcher

```js
const promiseProvider = function() { 
    return new Promise((resolve,reject) => {
        // do stuff
        resolve()
    })
}

promiseDispatcher.dispatchPromise(promiseProvider)
```

### startDispatching
A promise dispatcher instance starts to process promises once its startDispatching method is called

```js
promiseDispatcher.startDispatching()
```

### stopDispatching
A promise dispatcher instance stops to process promises once its stopDispatching method is called

```js
promiseDispatcher.stopDispatching()
```

## Examples

```js
const rate = 5 // promise rate per time interval
const interval = 1000 // time interval in ms
const promiseProviders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function(value) {
    return function () {
        return new Promise((resolve, reject) => {
            console.log(value)
            resolve(value)
        });
    };
});
```

### Queue mode
```js
(async function() {
  const promiseDispatcher = promiseDispatcher.new("QUEUE", rate, interval)
  promiseDispatcher.startDispatching()
  const promises = promiseDispatcher.dispatchPromises(promiseProviders)
  // expected console logs :
  // after 0 second : 1,2,3,4,5
  // after 1 second : 6,7,8,9,10
  const results = await Promise.all(promises)
  console.log(results)
 // expect results to be : 1,2,3,4,5,6,7,8,9,10
  promiseDispatcher.stopDispatching()
})();
```

### Stack mode
```js
(async function() {
    const promiseDispatcher = promiseDispatcher.new("STACK", rate, interval)
    promiseDispatcher.startDispatching()
    const promises = promiseDispatcher.dispatchPromises(tasks)
    // expected console logs :
    // after 0 second : 10,9,8,7,6
    // after 1 second : 5,4,3,2,1
    const results = await Promise.all(promises)
    console.log(results)
   // expect results to be : 10,9,8,7,6,5,4,3,2,1
    promiseDispatcher.stopDispatching()
})();
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-dispatcher
