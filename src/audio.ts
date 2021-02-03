import BufferLoader from "./buffer-loader"

import sound1 from "url:./sounds/1.flac"
import sound2 from "url:./sounds/2.flac"
import sound3 from "url:./sounds/3.flac"
import sound4 from "url:./sounds/4.flac"
import sound5 from "url:./sounds/5.flac"
import sound6 from "url:./sounds/6.flac"
import sound7 from "url:./sounds/7.flac"
import sound8 from "url:./sounds/8.flac"
import sound9 from "url:./sounds/9.flac"
import sound10 from "url:./sounds/10.flac"
import sound11 from "url:./sounds/11.flac"
import sound12 from "url:./sounds/12.flac"
import sound13 from "url:./sounds/13.flac"
import sound14 from "url:./sounds/14.flac"
import sound15 from "url:./sounds/15.flac"
import sound16 from "url:./sounds/16.flac"

export let context = new AudioContext()

export let loader = new BufferLoader(
	context,
	[
		sound1,
		sound2,
		sound3,
		sound4,
		sound5,
		sound6,
		sound7,
		sound8,
		sound9,
		sound10,
		sound11,
		sound12,
		sound13,
		sound14,
		sound15,
		sound16,
	],
	() => {}
)

loader.load()

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

let sources: AudioBufferSourceNode[] = []

export function playSound(index: number, pitch: number, time: number) {
	let sample = loader.buffers[index]

	if (sample) {
		let old = sources[index]
		if (old) {
			old.stop(time)
		}
		let source = (sources[index] = context.createBufferSource())
		source.buffer = sample
		source.connect(context.destination)
		source.detune.setValueAtTime(scale[pitch], time)x
		source.start(time)
	}
}
