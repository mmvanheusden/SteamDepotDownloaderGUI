import {getVersion} from "@tauri-apps/api/app";
import {open} from "@tauri-apps/plugin-shell";
import $ from "jquery";


$(async () => {
	$("#version-info").text(`v${await getVersion()}`);

	$("#theme-auto").on("click", () => {
		setTheme("auto");
	});
	$("#theme-light").on("click", () => {
		setTheme("light");
	});
	$("#theme-dark").on("click", () => {
		setTheme("dark");
	});

	$("#folder-name-appid").on("click", () => {
		$("#folder-name-custom").attr("aria-selected", "false");
		$("#folder-name-appid").attr("aria-selected", "true");
		$("#folder-name-custom-input").prop("disabled", true);
		$("#folder-name-custom-input").val("");
	});

	// todo: fix folder-name-custom-input not disabled on untouched app state

	$("#folder-name-custom").on("click", () => {
		$("#folder-name-appid").attr("aria-selected", "false");
		$("#folder-name-custom").attr("aria-selected", "true");
		$("#folder-name-custom-input").prop("disabled", false);
	});

	console.log(await getVersion());

	$("#version-info").on("click", async () => {
		await open(`https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/v${await getVersion()}`);
	});
});

function setTheme(theme: string) {
	$("#theme-auto").attr("aria-selected", String(theme === "auto"));
	$("#theme-light").attr("aria-selected", String(theme === "light"));
	$("#theme-dark").attr("aria-selected", String(theme === "dark"));
	$("#theme").attr("data-color-mode", theme);
}
