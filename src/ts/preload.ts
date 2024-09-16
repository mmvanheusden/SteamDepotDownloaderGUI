import {message} from "@tauri-apps/plugin-dialog";
import {invoke} from "@tauri-apps/api/core";
import {open} from "@tauri-apps/plugin-shell";
import $ from "jquery";


$(async () => {
	/* eslint-disable indent */
	switch (await invoke("internet_connection")) {
		case false: {
			await message("No internet connection! Can't proceed.", {
				title: "SteamDepotDownloaderGUI", kind: "error", okLabel: "Close"
			});
		}
	}
	/* eslint-enable indent */

	//discord
	$("#smbtn1").on("click", () => {
		open("https://discord.com/invite/3qCt4DT5qe");
	});
	// steamdb
	$("#smbtn2").on("click", () => {
		open("https://steamdb.info/instantsearch");
	});
	// donate
	$("#smbtn3").on("click", () => {
		open("https://paypal.me/onderkin");
	});
	// tutorial
	$("#smbtn4").on("click", () => {
		open("https://youtube.com/playlist?list=PLRAjc5plLScj967hnsYX-I3Vjw9C1v7Ca");
	});
});