export default class BufferLoader {
	buffers: AudioBuffer[]
	count: number

	constructor(
		public context: AudioContext,
		public urls: string[],
		public onload: (buffers: AudioBuffer[]) => any
	) {
		this.buffers = new Array()
		this.count = 0
	}

	loadOne(url: string, index: number) {
		let request = new XMLHttpRequest()
		request.open("GET", url, true)
		request.responseType = "arraybuffer"
		request.onload = () => {
			this.context.decodeAudioData(request.response, buffer => {
				if (!buffer) {
					throw new Error(`couldnt decode: ${url}`)
				}

				this.buffers[index] = buffer
				if (++this.count == this.urls.length) {
					this.onload(this.buffers)
				}
			})
		}

		request.onerror = () => {
			throw new Error(`request fail: ${url}`)
		}

		request.send()
	}

	load() {
		let loadOne = this.loadOne.bind(this)
		this.urls.forEach(loadOne)
	}
}
