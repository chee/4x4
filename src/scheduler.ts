import type {PitchVelocity, Store, State} from "./index"
import {playSound} from "./audio"
import "url:./worker.js"

interface Scheduled {
	step: number
	time: number
}

export default class Scheduler {
	queue: Scheduled[]
	step: number
	currentTime: number
	worker: Worker
	bpm: number
	scheduleTime: number

	constructor(private store: Store<State>, public context: AudioContext) {
		this.worker = new Worker("worker.js")
		this.post({tick: 25})
		this.worker.onmessage = (event: MessageEvent) => {
			if (event.data == "tick") {
				this.run()
			} else if (event.data == "step") {
				let t = this.context.currentTime
				let closest = this.queue
					.slice(0, 32)
					.reduce(
						(p, c) => (Math.abs(c.time - t) < Math.abs(p.time - t) ? c : p),
						{time: 0, step: 0}
					).step

				this.store.send(state => {
					state.step = closest
					return state
				})
			} else {
				console.log("WORKER", event.data)
			}
		}
		this.currentTime = 0
		this.step = 0
		this.queue = []
		this.reset()
		this.store.sub(() => this.updateBpm())
		this.bpm = this.store.get().bpm
		this.scheduleTime = 60 / this.bpm
		this.updateBpm()
	}

	post(message: any) {
		this.worker.postMessage(message)
	}

	play() {
		this.post("play")
		this.post({step: (60 / this.bpm / 4) * 1000})
	}

	pause() {
		this.pause()
	}

	updateBpm() {
		this.bpm = this.store.get().bpm
		this.scheduleTime = 60 / this.bpm
	}

	reset() {
		this.currentTime = 0
		this.step = 0
		this.queue = []
	}

	next() {
		this.currentTime += 60 / this.bpm / 4
		if (++this.step == 16) {
			this.step = 0
		}
	}

	schedule() {
		let {sounds} = this.store.get()
		this.queue.unshift({step: this.step, time: this.currentTime})
		sounds.forEach((sound, index) => {
			let pv = sound[this.step]
			if (pv) {
				let [pitch] = pv
				playSound(index, pitch, this.currentTime)
			}
		})
	}

	run() {
		while (this.currentTime < this.context.currentTime + this.scheduleTime) {
			this.schedule()
			this.next()
		}
	}
}
