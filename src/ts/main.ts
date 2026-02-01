import $ from "jquery";
import {invoke} from "@tauri-apps/api/core";
import {open as openDialog} from "@tauri-apps/plugin-dialog";
import {openPath, openUrl} from '@tauri-apps/plugin-opener';
import "@xterm/xterm/css/xterm.css";
import {Terminal} from "@xterm/xterm";
import { FitAddon } from '@xterm/addon-fit';

function setLoader(state: boolean) {
	$("#busy").prop("hidden", !state);
}


function setLoadingState(state: boolean) {
	$("#busy").prop("hidden", !state);

	// loop through all buttons and input fields and disable them
	for (const element of document.querySelectorAll("button, input")) {
		if (element.closest("#settings-content")) continue;
		(element as any).disabled = state;
	}

	// These elements need additional properties to be properly disabled
	$("#pickpath").prop("ariaDisabled", state);
	$("#downloadbtn").prop("ariaDisabled", state);

	// disable internet buttons
	for (const element of document.querySelectorAll("#internet-btns div")) {
		element.ariaDisabled = String(state);
	}
}


/// Returns list of IDs of invalid form fields
const invalidFields = () => {
	const form = document.forms[0];

	const invalidFields: string[] = [];
	for (const input of form) {
		const inputElement = input as HTMLInputElement;
		const valid = !(inputElement.value === "" && inputElement?.parentElement?.classList.contains("required"));
		if (!valid) {
			invalidFields.push(inputElement.id);
		}
	}
	// console.debug(`[${invalidFields.join(", ")}] fields invalid/empty`);

	return invalidFields;
};

const registerTerminal = async (terminalElement: HTMLElement) => {
	const fitAddon = new FitAddon();
	const term = new Terminal({
		fontSize: 10,
		cursorBlink: true,
		rows: 100,
		cols: 100,
		theme: {
			background: "rgb(47, 47, 47)",
		},
	});
	term.loadAddon(fitAddon);
	term.open(terminalElement);
	async function fitTerminal() {
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
	await fitTerminal();

	async function readFromPty() {
		const data = await invoke<string>("async_read_from_pty");

		if (data) {
			await writeToTerminal(data);
		}
		window.requestAnimationFrame(readFromPty);
	}

	window.requestAnimationFrame(readFromPty);
}


$(async () => {
	await registerTerminal($("#xtermjs")[0]);
	let downloadDirectory: string | null;

	// Startup logic
	setLoadingState(true);
	await invoke("preload_vectum");
	setLoadingState(false);


	$("#pickpath").on("click", async () => {
		// Open a dialog
		downloadDirectory = await openDialog({
			title: "Choose where to save the game download.",
			multiple: false,
			directory: true,
			canCreateDirectories: true
		});

		if (downloadDirectory == null) {
			// user cancelled
			$("#checkpath").prop("ariaDisabled", true);
			$("#checkpath").prop("disabled", true);
			return;
		}

		$("#checkpath").prop("ariaDisabled", false);
		$("#checkpath").prop("disabled", false);
		$("#downloadbtn").prop("ariaDisabled", false);
		$("#nopathwarning").prop("hidden", true);


		console.log(downloadDirectory);
	});

	$("#checkpath").on("click", async () => {
		console.log(`Checking path: ${downloadDirectory}`);

		if (downloadDirectory != null) {
			await openPath(downloadDirectory);
		} else {
			$("#checkpath").prop("ariaDisabled", true);
		}
	});

	$("#downloadbtn").on("click", async () => {
		console.log("download button clicked");

		if (invalidFields().length > 0) {
			// Loop through invalid fields. If there are any, make those "errored" and block the download button.
			for (const id of invalidFields()) {
				document.getElementById(id)?.parentElement?.classList.toggle("errored", true);
			}
			$("#emptywarning").prop("hidden", false);
			$("#downloadbtn").prop("ariaDisabled", true);
			return;
		}

		if (downloadDirectory == null) {
			$("#nopathwarning").prop("hidden", false);
			$("#downloadbtn").prop("ariaDisabled", true);
			return;
		}

		setLoadingState(true);
		$("#downloadingnotice").prop("hidden", false);
		$("#busy").prop("hidden", true); // Don't show the loader this time.

		const directoryNameChoice = $("#folder-name-custom-input").val();

		// Output path w/ directories chosen is: {downloadDirectory}/{directoryNameChoice}
		const vectumOptions = {
			output_directory: downloadDirectory || null, // if not specified let backend choose a path.
			directory_name: directoryNameChoice || null,
		};

		const steamDownload = {
			// String || null translate to Some(String) || None
			username: String($("#username").val()).trim() || null,
			password: String($("#password").val()).trim() || null,
			app_id: $("#appid").val(),
			depot_id: $("#depotid").val(),
			manifest_id: $("#manifestid").val(),
			options: vectumOptions
		};

		// console.debug(steamDownload);
		await invoke("download_depotdownloader");

		$("#downloadingnotice").prop("hidden", true);
		setLoadingState(false);

		console.debug("DepotDownloader download process completed. Starting game download...");

		await invoke("start_download", {steamDownload: steamDownload});
		console.log("Send frontend data over to backend. Ready for next download.");
	});

	$("#settings-button").on("click", async () => {
		$("#settings-surrounding").toggle();
	});

	$("#settings-surrounding").on("click", (event) => {
		if (event.target === document.getElementById("settings-surrounding")) {
			$("#settings-surrounding").toggle();
		}
	});

	$("#opium-btn").on("click", () => {
		openUrl("https://aphex.cc/index.html");
	});


	document.forms[0].addEventListener("input", (event) => {
		// Remove errored class. This is a bad way to do it, but it works for now.
		const target = event.target as HTMLElement;
		target?.parentElement?.classList.toggle("errored", false);

		// If there are no more invalid fields, hide the warning and enable the download button again
		if (invalidFields().length === 0) {
			$("#emptywarning").prop("hidden", true);
			$("#downloadbtn").prop("ariaDisabled", false);
		}
	});
});