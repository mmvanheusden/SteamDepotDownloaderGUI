import {invoke} from "@tauri-apps/api/core";
import {FitAddon} from "@xterm/addon-fit";
import {Terminal} from "@xterm/xterm";
import {useContext, useEffect, useRef, useState} from "preact/hooks";
import "@xterm/xterm/css/xterm.css";
import {AppContext} from "../context";
import {listen} from "@tauri-apps/api/event";

/* Parts of this file are derived from https://github.com/cablehead/tauri-xtermjs-nushell/blob/0bdd4a27ee2874de12e99bccd6c91d6ec5d28fbc/src/main.ts */

export function DownloaderOutput() {
	const context = useContext(AppContext);
	const [terminal, setTerminal] = useState<Terminal | undefined>();
	
	// Hook on the "command-exited" Tauri emitter, and wait for it to emit, so we can flip the downloading state.
	listen("command-exited", () => {
	  context.downloading?.[1]?.(false);
	}).catch(console.error);
	
	const terminalWindowRef = useRef(null);
	
	useEffect(() => {
		setTerminal(registerTerminal(terminalWindowRef.current!));
	}, []);
	
	return (
		<div class="mt-2 h-full w-full mx-auto">
			<div class="border border-gray-300 rounded-md bg-gray-900 text-white shadow shadow-blue-200">
				<div class="text-md font-semibold w-full inline-flex my-px items-center">
					<span class="text-center w-full">Download output</span>
					{terminal &&
						<button onClick={() => { if (!context.downloading![0]) terminal.reset(); }} type="button" disabled={context.downloading![0] ?? false} class="disabled:cursor-not-allowed disabled:line-through disabled:text-gray-300 ml-auto mr-2 my-1 py-px px-2 border-2 rounded-xs border-red-500/75 font-normal enabled:hover:bg-red-200/30 enabled:active:bg-red-200/50">
							Clear
						</button>
					}
					
				</div>
				<div ref={terminalWindowRef} class="max-h-[74vh]"></div>
			</div>
		</div>
		
	);
}

const registerTerminal: (terminalElement: HTMLElement) => Terminal = (terminalElement: HTMLElement) => {
	/* eslint-disable @typescript-eslint/no-misused-promises */
	const fitAddon = new FitAddon();
	const term = new Terminal({
		fontSize: 10,
		cursorBlink: true,
		rows: 100,
		cols: 100,
		theme: {
			background: "rgb(30,33,46)",
		},
	});
	term.loadAddon(fitAddon);
	term.open(terminalElement);
	function fitTerminal() {
		fitAddon.fit();
		void invoke<string>("async_resize_pty", {
			rows: term.rows,
			cols: term.cols,
		});
	}

	// Write data from pty into the terminal
	function writeToTerminal(data: string) {
		return new Promise<void>((r) => {
			term.write(data, () => r());
		});
	}

	// Write data from the terminal to the pty
	function writeToPty(data: string) {
		void invoke("async_write_to_pty", {
			data,
		});
	}
	term.onData(writeToPty);
	addEventListener("resize", fitTerminal);
	fitTerminal();

	async function readFromPty() {
		const data = await invoke<string>("async_read_from_pty");

		if (data) {
			await writeToTerminal(data);
		}
		
		window.requestAnimationFrame(readFromPty);
	}

	window.requestAnimationFrame(readFromPty);

	return term;
};

