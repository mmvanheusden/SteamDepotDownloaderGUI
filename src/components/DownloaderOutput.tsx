import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { AppContext } from "../context";

/* Parts of this file are derived from https://github.com/cablehead/tauri-xtermjs-nushell/blob/0bdd4a27ee2874de12e99bccd6c91d6ec5d28fbc/src/main.ts */

export function DownloaderOutput() {
	const context = useContext(AppContext);
	const [terminal, setTerminal] = useState<Terminal | undefined>();
	const [downloading, ] = context.downloading!;
	
	// Hook on the "command-exited" Tauri emitter, and wait for it to emit, so we can flip the downloading state.
	listen("command-exited", () => {
	  context.downloading?.[1]?.(false);
	}).catch(console.error);
	
	const terminalWindowRef = useRef(null);
	
	useEffect(() => {
		setTerminal(registerTerminal(terminalWindowRef.current!));
	}, []);
	
	return (
		<div class="mx-auto mt-2 w-full h-full">
			<div class="text-white bg-gray-900 rounded-md border border-gray-300 shadow shadow-blue-200">
				<div class="inline-flex items-center my-px w-full font-semibold text-md">
					<span class="w-full text-center">Download output</span>
					{terminal &&
						<button onClick={() => { if (!downloading) terminal.reset(); }} type="button" disabled={downloading ?? false} class="py-px px-2 my-0.5 mr-1.5 ml-auto font-normal border-2 disabled:text-gray-300 disabled:line-through disabled:cursor-not-allowed rounded-xs border-red-500/75 enabled:hover:bg-red-200/30 enabled:active:bg-red-200/50">
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

