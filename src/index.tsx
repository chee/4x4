import {h, Component, render, createContext} from "preact"
/* @jsx h */
import {useMemo, useEffect, useContext} from "preact/hooks"
import Scheduler from "./scheduler"
import {context, playSound, loader} from "./audio"
import classnames from "classnames"

export type PitchVelocity = [number, number] | null
export type Mode =
	| "normal"
	| "sound"
	| "pattern"
	| "bpm"
	| "record"
	| "effects"
	| "write"

export interface State {
	step: number
	playing: boolean
	mode: Mode
	pattern: number
	sound: number
	pitch: number
	velocity: number
	bpm: number
	sounds: PitchVelocity[][]
}

export interface Store<S extends State> {
	get: () => S
	sub: (fn: (previous: S) => any) => () => any
	send: (transformer: Trans<S>) => Store<S>
}

type Trans<S extends State> = (s: S) => S

function createStore(initialState: State): Store<State> {
	let state: State = {...initialState}
	let subs: Set<(previous: State) => any> = new Set()
	return {
		get() {
			return state
		},
		send(transformer: Trans<State>) {
			let previous = state
			state = {...transformer({...state})}
			subs.forEach(sub => sub(previous))
			return this
		},
		sub(fn) {
			subs.add(fn)
			return () => {
				subs.delete(fn)
			}
		},
	}
}

let store = createStore({
	step: 0,
	playing: false,
	mode: "normal",
	pattern: 0,
	sound: 0,
	pitch: 4,
	velocity: 15,
	bpm: 80,
	sounds: Array.from(Array(16), () => Array.from(Array(16), () => null)),
})

store.sub(previous => {
	let state = store.get()
	if (previous.playing == state.playing) {
		return
	}

	if (state.playing) {
		scheduler.play()
	} else {
		scheduler.pause()
	}
})

let sources = Array(16)

let togglePlay = () => (state: State) => {
	state.playing = !state.playing
	if (state.playing) {
		state.step = 0
	}
	return state
}

let setSoundStep = (step: number) => (state: State) => {
	let sound = state.sounds[state.sound]
	let value: PitchVelocity
	let soundStep = sound[step]
	if (soundStep && soundStep[0] == state.pitch) {
		value = null
	} else {
		value = [state.pitch, state.velocity]
	}
	state.sounds[state.sound] = state.sounds[state.sound].map((n, index) => {
		return index == step ? value : n
	})
	return state
}

let setPitch = (value: number) => (state: State) => {
	state.pitch = value
	return state
}

let setSound = (value: number) => (state: State) => {
	state.sound = value
	return state
}

let setMode = (value: Mode) => (state: State) => {
	state.mode = state.mode == value ? "normal" : value
	return state
}

let makeHandleSequenceButtonClick = (id: number) => () => {
	let state = store.get()
	if (state.mode == "write") {
		// if (store.sounds[store.sound][step]) {
		//        store.send("clearSoundStep", step)
		// }
		store.send(setSoundStep(id))
	}
	if (state.mode == "normal") {
		store.send(setPitch(id))
		playSound(state.sound, id, context.currentTime)
	}
	if (state.mode == "sound") {
		store.send(setSound(id))
		store.send(setMode("normal"))
	}
}

interface SequenceButtonProps {
	id: number
	steps: PitchVelocity[]
	mode: Mode
	step: number
	playing: boolean
}

function SequenceButton({id, steps, mode, step, playing}: SequenceButtonProps) {
	let handleClick = makeHandleSequenceButtonClick(id)

	// TODO find out the type for file change event
	async function handleChange(event: any) {
		let file = event.target.files[0]
		let url = URL.createObjectURL(file)
		loader.loadOne(url, id)
		store.send(setMode("normal"))
	}

	return (
		<label for={id}>
			<input
				onMouseDown={handleClick}
				onChange={handleChange}
				id={id}
				type={mode == "record" ? "file" : "button"}
				accept="audio/*"
				capture
				class={classnames({
					button: true,
					control: true,
					"seq-button": true,
					"seq-button--scheduled": mode == "write" && steps[id],
					"seq-button--current": playing && step == id,
				})}
			/>
			{String(id + 1)}
		</label>
	)
}

let StoreContext = createContext("store")

let connect = (map: (state: State) => any) => (WrappedComponent: Component) => {
	return ({...props}) => {
		return (
			<StoreContext.Consumer>
				{(state: State) => <WrappedComponent {...props} {...map(state)} />}
			</StoreContext.Consumer>
		)
	}
}

let ConnectedSequenceButton = connect(state => {
	return {
		steps: state.sounds[state.sound],
		mode: state.mode,
		step: state.step,
		playing: state.playing,
	}
})(SequenceButton)

interface ModeButtonProps {
	activeMode: Mode
	mode: Mode
}

let ModeButton = connect(({mode}) => ({activeMode: mode}))(function ModeButton({
	activeMode,
	mode,
}: ModeButtonProps) {
	let handleClick = () => store.send(setMode(mode))

	return (
		<label for={mode}>
			<input
				onMouseDown={handleClick}
				id={mode}
				type="button"
				class={classnames({
					button: true,
					control: true,
					mode: true,
					"mode--active": mode == activeMode,
				})}
			/>
			{mode}
		</label>
	)
})

interface PlayButtonProps {
	playing: boolean
}

function PlayButton({playing}: PlayButtonProps) {
	let handleClick = () => store.send(togglePlay())

	return (
		<label htmlFor="play">
			<input
				onMouseDown={handleClick}
				id="play"
				type="button"
				class="button control"
			/>
			{playing ? "pause" : "play"}
		</label>
	)
}

let ConnectedPlayButton = connect(state => {
	return {playing: state.playing}
})(PlayButton)

let Screen = connect(({mode, playing, sound, pitch, bpm, step}) => ({
	mode,
	playing,
	sound,
	pitch,
	bpm,
	step,
}))(function Screen({mode, playing, sound, pitch, bpm, step}: Partial<State>) {
	return (
		<aside>
			<pre class="screen" id="screen">
				mode: {mode}
				{"\n"}
				playing: {playing ? "yes" : "no"}
				{"\n"}
				sound: {sound}
				{"\n"}
				pitch: {pitch}
				{"\n"}
				bpm: {bpm}
				{"\n"}
				step: {step}
			</pre>
		</aside>
	)
})

class Pocket extends Component {
	state: State
	constructor() {
		super()
		this.state = store.get()
	}

	componentDidMount() {
		store.sub(() => {
			this.setState(store.get())
		})
	}

	render() {
		return (
			<StoreContext.Provider value={this.state}>
				<Screen />
				<form className="controls">
					<fieldset class="control-section top-row">
						<ModeButton mode="sound" />
						<ModeButton mode="pattern" />
						<ModeButton mode="bpm" />
						{/* TODO encoder */}
						<ModeButton mode="sound" />
						<ModeButton mode="pattern" />
					</fieldset>
					<fieldset class="control-section sequencer">
						<ConnectedSequenceButton id={0} />
						<ConnectedSequenceButton id={1} />
						<ConnectedSequenceButton id={2} />
						<ConnectedSequenceButton id={3} />
						<ConnectedSequenceButton id={4} />
						<ConnectedSequenceButton id={5} />
						<ConnectedSequenceButton id={6} />
						<ConnectedSequenceButton id={7} />
						<ConnectedSequenceButton id={8} />
						<ConnectedSequenceButton id={9} />
						<ConnectedSequenceButton id={10} />
						<ConnectedSequenceButton id={11} />
						<ConnectedSequenceButton id={12} />
						<ConnectedSequenceButton id={13} />
						<ConnectedSequenceButton id={14} />
						<ConnectedSequenceButton id={15} />
					</fieldset>
					<fieldset class="control-section side-column">
						<ModeButton mode="record" />
						<ModeButton mode="effects" />
						<ConnectedPlayButton />
						<ModeButton mode="write" />
					</fieldset>
				</form>
			</StoreContext.Provider>
		)
	}
}

let scheduler = new Scheduler(store, context)

render(<Pocket />, document.getElementById("main"))
