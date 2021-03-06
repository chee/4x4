let tickInterval = null
let tick = 100

let stepInterval = null
let step = 100000

self.onmessage = function (event) {
	if (event.data == "play") {
		console.log("starting")
		tickInterval = setInterval(() => {
			self.postMessage("tick")
		}, tick)
	} else if (event.data.tick) {
		console.log("setting tick")
		tick = event.data.tick
		console.log("tick = " + tick)
		if (tickInterval) {
			clearInterval(tickInterval)
			tickInterval = setInterval(() => {
				postMessage("tick")
			}, tick)
		}
	} else if (event.data.step) {
		step = event.data.step
		clearInterval(stepInterval)
		stepInterval = setInterval(() => {
			postMessage("step")
		}, step)
	} else if (event.data == "pause") {
		console.log("stopping")
		clearInterval(tickInterval)
		clearInterval(stepInterval)
	}
}

postMessage("hi there")
