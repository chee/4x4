let tickInterval = null
let tick = 100

let stepInterval = null
let step = 100000

self.onmessage = function (event) {
	if (event.data == "play") {
		tickInterval = setInterval(() => {
			postMessage("tick")
		}, tick)
		stepInterval = setInterval(() => {
			postMessage("step")
		})
	} else if (event.data.tick) {
		tick = event.data.tick
		if (tickInterval) {
			clearInterval(tickInterval)
			tickInterval = setInterval(() => {
				postMessage("tick")
			}, tick)
		}
	} else if (event.data.step) {
		step = event.data.step
		if (stepInterval) {
			clearInterval(stepInterval)
			stepInterval = setInterval(() => {
				postMessage("step")
			}, step)
		}
	} else if (event.data == "pause") {
		clearInterval(tickInterval)
		clearInterval(stepInterval)
		tickInterval = null
		stepInterval = null
	}
}

postMessage("im ready 4 u")
