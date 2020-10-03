let context = new AudioContext()

function BufferLoader(context, urlList, callback) {
	this.context = context
	this.urlList = urlList
	this.onload = callback
	this.bufferList = new Array()
	this.loadCount = 0
}

BufferLoader.prototype.loadBuffer = function (url, index) {
	var request = new XMLHttpRequest()
	request.open("GET", url, true)
	request.responseType = "arraybuffer"

	var loader = this

	request.onload = function () {
		loader.context.decodeAudioData(request.response, function (buffer) {
			if (!buffer) {
				alert("error decoding file data: " + url)
				return
			}
			loader.bufferList[index] = buffer
			if (++loader.loadCount == loader.urlList.length)
				loader.onload(loader.bufferList)
		})
	}

	request.onerror = function () {
		alert("BufferLoader: XHR error")
	}

	request.send()
}

BufferLoader.prototype.load = function () {
	for (var i = 0; i < this.urlList.length; ++i)
		this.loadBuffer(this.urlList[i], i)
}

let loader = new BufferLoader(
	context,
	Array.from(Array(16), (_, index) => `./sounds/${index + 1}.flac`),
	bufferloaded
)
loader.load()

function createStore(handlers, state = {}) {
	let subs = new Set()
	return {
		get: function () {
			return state
		},
		send: function (event, data = null) {
			let handler = handlers[event]
			console.log(event, data)
			let previousState = Object.assign({}, state)
			if (handler) {
				state = handler(state, data)
			} else {
				throw new Error(`unknown handler: ${handler}`)
			}
			subs.forEach(sub => sub(previousState))
			return this
		},
		sub: function (fn) {
			subs.add(fn)
			return () => {
				subs.delete(fn)
			}
		},
	}
}

let handlers = {
	nextScheduleStep(state) {
		state.time += 60 / state.bpm / 4
		if (++state.scheduleStep == 16) {
			state.scheduleStep = 0
		}
		return state
	},
	nextStep(state) {
		if (++state.step == 16) {
			state.step = 0
		}
		return state
	},
	play(state) {
		state.playing = !state.playing
		if (state.playing) {
			state.scheduleStep = 0
			state.time = context.currentTime
		}
		return state
	},
	setSoundStep(state, step) {
		let sound = state.sounds[state.sound]
		let value
		console.log(
			sound[step],
			state.pitch,
			sound[step] && sound[step][0] === state.pitch
		)
		if (sound[step] && sound[step][0] === state.pitch) {
			value = null
		} else {
			value = [state.pitch, state.velocity]
		}

		state.sounds[state.sound] = Array.from(Array(16), (_, index) => {
			return index == step ? value : state.sounds[state.sound][index]
		})
		return state
	},
	setPitch(state, value) {
		state.pitch = value
		return state
	},
	setSound(state, value) {
		state.sound = value
		return state
	},
	mode(state, value) {
		state.mode = state.mode == value ? "normal" : value
		return state
	},
}

let makesoundsteparray = _ => Array.from(Array(16), _ => null)

let store = createStore(handlers, {
	step: 0,
	scheduleStep: 0,
	time: 0,
	playing: false,
	playingStep: 0,
	mode: "normal",
	pattern: 0,
	sound: 0,
	pitch: 4,
	velocity: 15,
	bpm: 80,
	// the pitch and velocity each sound is playing at a given step
	sounds: Array.from(Array(16), makesoundsteparray),
})

let sources = Array(16)

/** the detune (in cents) for each pitch */
let notes = [
	// 1
	-1200,
	// 2
	-1000,
	// 3
	-900,
	// 4
	-700,
	// 5
	-500,
	// 6
	-300,
	// 7
	-100,
	// 8
	0,
	// 9
	200,
	// 10
	300,
	// 11
	500,
	// 12
	700,
	// 13
	900,
	// 14
	1100,
	// 15
	1200,
	// 16
	21400,
]

let scale = [
	notes[12],
	notes[13],
	notes[14],
	notes[15],
	notes[8],
	notes[9],
	notes[10],
	notes[11],
	notes[4],
	notes[5],
	notes[6],
	notes[7],
	notes[0],
	notes[1],
	notes[2],
	notes[3],
]

let lookahead = 25
let scheduleTime = 60 / store.get().bpm
let queue = []

function playSound(index, pitch, time) {
	let sample = loader.bufferList[index]
	if (sample) {
		let old = sources[index]
		if (old) {
			old.stop(time)
		}
		let source = (sources[index] = context.createBufferSource())
		source.buffer = sample
		source.connect(context.destination)
		source.detune.setValueAtTime(scale[pitch], time)
		source.start(time)
	}
}

function scheduleStep() {
	let state = store.get()
	queue.push({step: state.scheduleStep, time: state.time})
	state.sounds.forEach((sound, soundIndex) => {
		if (sound[state.scheduleStep]) {
			let [pitch, velocity] = sound[state.scheduleStep]
			playSound(soundIndex, pitch, state.time)
		}
	})
}

function scheduler() {
	let state = store.get()
	while (state.time < context.currentTime + scheduleTime) {
		scheduleStep()
		store.send("nextScheduleStep")
	}
}

let worker = new Worker("worker.js")
worker.onmessage = function (event) {
	if (event.data == "tick") {
		scheduler()
	} else if (event.data == "step") {
		store.send("step")
	} else {
		console.log("WORKER", event.data)
	}
}

worker.postMessage({interval: lookahead})

document.getElementById("play").onclick = function () {
	store.send("play")
}

store.sub(previous => {
	let state = store.get()
	if (previous.playing == state.playing) {
		return
	}

	if (state.playing) {
		worker.postMessage("play")
	} else {
		worker.postMessage("pause")
	}
})

let seqbuttons = document.querySelectorAll(".seq-button")
let interval = null

store.sub(previous => {
	let state = store.get()
	if (state.playing == previous.playing) return
	if (state.playing) {
		document.body.classList.add("playing")
	} else {
		document.body.classList.remove("playing")
	}
})

store.sub(previous => {
	let state = store.get()
	if (
		state.sound == previous.sound &&
		state.sound[state.sound] == previous.sounds[state.sound]
	) {
		return
	}
})

// import { h, Component, render } from 'https://unpkg.com/preact?module'
// import htm from 'https://unpkg.com/htm?module'
// let html = htm.bind(h)

seqbuttons.forEach(button => {
	button.addEventListener("click", () => {
		let state = store.get()
		if (state.mode == "write") {
			let step = button.id - 1
			// if (store.sounds[store.sound][step]) {
			//        store.send("clearSoundStep", step)
			// }
			store.send("setSoundStep", button.id - 1)
		}
		if (state.mode == "normal") {
			let pitch = button.id - 1
			store.send("setPitch", pitch)
			playSound(state.sound, pitch, context.currentTime)
		}
		if (state.mode == "sound") {
			let sound = button.id - 1
			store.send("setSound", sound)
			store.send("mode", "normal")
		}
	})
})

document.getElementById("write").addEventListener("click", () => {
	let state = store.get()
	store.send("mode", "write")
})

document.getElementById("sound").addEventListener("click", () => {
	let state = store.get()
	store.send("mode", "sound")
})

let output = document.getElementById("screen")
function updateOutput() {
	let state = store.get()
	output.textContent = `mode: ${state.mode}
playing: ${state.playing}
sound: ${state.sound}
pitch: ${state.pitch}
bpm: ${state.bpm}
`
}
store.sub(updateOutput)
updateOutput()
function bufferloaded() {}

// encoder
// at the moment this is a range, it shouldn't be. it /could/ be a type=number, or it could be two buttons? up and down... yes! i think it is two buttons

// [[file:html.js.org::*encoder][encoder:1]]

// encoder:1 ends here
