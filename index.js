class PromiseDispatcher {
    constructor(mode = "QUEUE", rate = null, interval = 1000) {
        this.mode = mode
        this.rate = rate
        this.interval = interval
        this.tasks = []
        this.ticks = []
    }

    dispatchPromise(promiseProvider) {
        var dispatchedPromiseResolve, dispatchedPromiseReject
        var dispatchedPromise = new Promise((resolve, reject) => { dispatchedPromiseResolve = resolve; dispatchedPromiseReject = reject })

        switch(this.mode) {
            case "QUEUE":
            default:
                this.tasks.unshift({ promiseProvider, resolve: dispatchedPromiseResolve, reject: dispatchedPromiseReject })
            break;
            case "STACK":
                this.tasks.push({ promiseProvider, resolve: dispatchedPromiseResolve, reject: dispatchedPromiseReject })
            break;
        }

        return dispatchedPromise
    }

    dispatchPromises(promiseProviders) {
        const dispatchedPromises = [] 

        for (const promiseProvider of promiseProviders) {
            const dispatchedPromise = this.dispatchPromise(promiseProvider)
            switch(this.mode) {
                case "QUEUE":
                default:
                    // reverse promise order to return firstly dispatched promise in first position of returned array
                    dispatchedPromises.push(dispatchedPromise)
                break;
                case "STACK":
                    // reverse promise order to return firstly dispatched promise in first position of returned array
                    dispatchedPromises.unshift(dispatchedPromise)
                break;
            }
        }
        
        return dispatchedPromises
    }

    startDispatching() {
        this.loop = setInterval(() => {
            // remove all the task execution ticks that were triggered before last interval  
            var now = Date.now()
            while (now - this.ticks[0] > this.interval) {
                this.ticks.shift()
            }

            // launch new task executions to fill current interval according to required rate
            while (this.tasks.length > 0 && (!this.rate || this.ticks.length < this.rate)) {
                // fetch next task
                const { promiseProvider, resolve, reject } = this.tasks.pop()
                
                // trigger task execution 
                const executedPromise = promiseProvider()
                // bind resolve and reject to wrapping promise
                executedPromise.then(result => resolve(result)).catch(error => reject(error))
                // track task execution tick
                now = Date.now()
                this.ticks.push(now)
            }
        }, 1)
    }

    stopDispatching() {
        if(this.loop) clearInterval(this.loop)
    }
}

module.exports = PromiseDispatcher