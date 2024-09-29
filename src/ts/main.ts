import $ from "jquery";
import {invoke} from "@tauri-apps/api/core";
import {open as openDialog} from "@tauri-apps/plugin-dialog";
import {open as openShell} from "@tauri-apps/plugin-shell";
import {listen} from "@tauri-apps/api/event";

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


$(async () => {
	let terminalsCollected = false;
	let downloadDirectory: string | null;

	// Startup logic
	setLoadingState(true);

	await invoke("preload_vectum");

	setLoadingState(false);


	// Collect the rest of the terminals in the background.
	if (!terminalsCollected) {
		setLoader(true);
		// @ts-ignore
		const terminals = await invoke("get_all_terminals") as string[];
		for (const terminal in terminals) {
			console.log(terminal);
		}

		// Allow opening settings now that it is ready to be shown.
		$("#settings-button").prop("ariaDisabled", false);
		terminalsCollected = true;
		setLoader(false);
	}

	$("#pickpath").on("click", async () => {
		// Open a dialog
		downloadDirectory = await openDialog({
			title: "Choose where to download the game. You can specify the directory later.",
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

		console.log(downloadDirectory);
	});

	$("#checkpath").on("click", async () => {
		console.log(`Checking path: ${downloadDirectory}`);

		if (downloadDirectory != null) {
			await openShell(downloadDirectory);
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
				$("#emptywarning").prop("hidden", false);
				$("#downloadbtn").prop("ariaDisabled", true);
			}
			return;
		}

		setLoadingState(true);
		$("#downloadingnotice").prop("hidden", false);
		$("#busy").prop("hidden", true); // Don't show the loader this time.

		const terminalChoice = (document.getElementById("terminal-dropdown") as HTMLSelectElement).selectedIndex;
		const directoryNameChoice = $("#folder-name-custom-input").val();


		// Output path w/ directories chosen is: {downloadDirectory}/{directoryNameChoice}
		const vectumOptions = {
			terminal: terminalChoice == 15 ? null : terminalChoice,
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
		if (terminalsCollected) $("#settings-surrounding").css("display", "block");
	});

	$("#settings-surrounding").on("click", (event) => {
		if (event.target === document.getElementById("settings-surrounding")) {
			$("#settings-surrounding").css("display", "none");

		}
	});

	$("#opium-btn").on("click", () => {
		openShell("https://00pium.net");
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


let a = 0;
// Each terminal that is installed gets received from rust with this event.
listen<[number, number]>("working-terminal", (event) => {
	a++;
	console.log(
		`Terminal #${event.payload[0]} is installed. a = ${a}`
	);
	const terminalSelection = (document.getElementById("terminal-dropdown") as HTMLSelectElement);

	// Enable the <option> of the terminal because we know it is available. Ignore null check because we know it is valid.
	// @ts-ignore
	terminalSelection.options.item(event.payload[0]).disabled = false;
	// @ts-ignore 16

	terminalSelection.options.item(event.payload[0]).text = terminalSelection.options.item(event.payload[0]).text.slice(0,-16);

	$("#terminals-found").text(`${a}/${event.payload[1]}`);
});


listen<string>("default-terminal", (event) => {
	console.log(
		`Default terminal is ${event.payload}.`
	);

	$("#default-terminal").text(event.payload);
});