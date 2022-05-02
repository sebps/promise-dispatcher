# PromiseManager

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
const PromiseManager = require('promise-dispatcher');
```

### Creating a new promise manager instance
```js
const promiseManager = new PromiseManager(tasks, mode = "QUEUE", rate = 1, interval = 1000)
```

### Register a new promise
To register a new promise in a promise manager instance, it must be wrapped into a provider function that return the promise so that it can be executed whenever necessary by the promise manager

```js
const promiseProvider = function() { 
    return new Promise((resolve,reject) => {
        // do stuff
        resolve()
    })
}

promiseManager.registerPromise(promiseProvider)
```

### startExecution
A promise manager instance starts to process promises once its startExecution method is called

```js
promiseManager.startExecution()
```

### stopExecution
A promise manager instance stops to process promises once its stopExecution method is called

```js
promiseManager.stopExecution()
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
  const promiseManager = promiseManager.new("QUEUE", rate, interval)
  promiseManager.startExecution()
  promiseManager.registerPromises(promiseProviders)
  // expected console logs :
  // after 0 second : 1,2,3,4,5
  // after 1 second : 6,7,8,9,10
  promiseManager.stopExecution()
})();
```

### Stack mode
```js
(async function() {
    const promiseManager = promiseManager.new("STACK", rate, interval)
    promiseManager.startExecution()
    promiseManager.registerPromises(tasks)
    // expected console logs :
    // after 0 second : 10,9,8,7,6
    // after 1 second : 5,4,3,2,1
    promiseManager.stopExecution()
})();
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-dispatcher
