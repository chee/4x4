let id = null
let interval = 100

self.onmessage = function (event) {
	if (event.data == "play") {
		console.log("starting")
		id = setInterval(function () {
			self.postMessage("tick")
		}, interval)
	} else if (event.data.interval) {
		console.log("setting interval")
		interval = event.data.interval
		console.log("interval = " + interval)
		if (id) {
			clearInterval(id)
			id = setInterval(function () {
				postMessage("tick")
			}, interval)
		}
	} else if (event.data == "pause") {
		console.log("stopping")
		clearInterval(id)
		id = null
	}
}

postMessage("hi there")
