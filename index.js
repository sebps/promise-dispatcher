class PromiseDispatcher {
    constructor(mode = "QUEUE", rate = null, interval = 1000) {
        this.mode = mode
        this.rate = rate
        this.interval = interval
        this.tasks = []
        this.ticks = []
    }

    registerPromise(task) {
        switch(this.mode) {
            case "QUEUE":
            default:
                this.tasks.unshift(task)
            break;
            case "STACK":
                this.tasks.push(task)
            break;
        }
    }

    registerPromises(tasks) {
        for(const task of tasks) {
            this.registerPromise(task)
        }
    }

    startExecution() {
        this.loop = setInterval(() => {
            // remove all the task execution ticks that were triggered before last interval  
            var now = Date.now()
            while (now - this.ticks[0] > this.interval) {
                this.ticks.shift()
            }
    
            // launch new task executions to fill current interval according to required rate
            while (this.tasks.length > 0 && (!this.rate || this.ticks.length < this.rate)) {
                // fetch next task
                const nextTask = this.tasks.pop()
                // trigger task execution
                nextTask()
                // track task execution tick
                now = Date.now()
                this.ticks.push(now)
            }
        }, 1)
    }

    stopExecution() {
        if(this.loop) clearInterval(this.loop)
    }
}

module.exports = PromiseDispatcher