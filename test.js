const expect = require('chai').expect;
const index = require('./index')
const wait = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}

describe('Promise Dispatcher', function() {
  this.timeout(60000)
  var results = [];
  var rate 
  var interval
  var promiseDispatcher;

  const promiseProviders = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(function(value, index) {
    return function() {
      return new Promise((resolve, reject) => {
        results.push(value)
        resolve()
      });
    };
  })

  describe('Promise Dispatcher with interval of 1s and rate of 5 : ', function() {
    before(function() {
        results = [];
        rate = 5
        interval = 1000
    });

    describe('QUEUE mode : ', function() {
        before(function() {
            results = []
            promiseDispatcher = new index("QUEUE", rate, interval)
            promiseDispatcher.startExecution()
        })

        after(function() {
            promiseDispatcher.stopExecution()
        })

        it('1 set of 15 promises : should be received as 3 batches of 5 ordered integer within a 1 second interval', async function() {
            promiseDispatcher.registerPromises(promiseProviders)
            
            // after 100 ms 5 promises should have been sent and resolved 
            await wait(100)
            expect(results).to.eql([1, 2, 3, 4, 5]);
            
            // after 1s 10 promises should have been sent and resolved 
            await wait(1000)
            expect(results).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

            // after 1s 15 promises should have been sent and resolved 
            await wait(1000)
            expect(results).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        })
    })

    describe('STACK mode : ', function() {
        before(function() {
            results = []
            promiseDispatcher = new index("STACK", rate, interval)
            promiseDispatcher.startExecution()
        })

        after(function() {
            promiseDispatcher.stopExecution()
        })

        it('1 set of 15 promises : should be received as 3 batches of 5 reverse ordered integer within a 1 second interval', async function() {
            promiseDispatcher.registerPromises(promiseProviders)
            
            // after 500 ms 5 promises should have been sent and resolved 
            await wait(100)
            expect(results).to.eql([15, 14, 13, 12, 11]);
            
            // after 1s 10 promises should have been sent and resolved 
            await wait(1000)
            expect(results).to.eql([15, 14, 13, 12, 11, 10, 9, 8, 7, 6]);

            // after 1s 15 promises should have been sent and resolved 
            await wait(1000)
            expect(results).to.eql([15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
        })
    })
  })
})