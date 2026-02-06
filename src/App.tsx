import { getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useState } from "preact/hooks";
import { DownloaderForm } from "./components/DownloaderForm.tsx";
import { DownloaderOutput } from "./components/DownloaderOutput.tsx";
import { Settings } from "./components/Settings.tsx";
import { AppContext, AppSettings } from "./context.ts";
import "./css/App.css";

const appVersion = await getVersion();


// Settings defaults are defined here.
const DEFAULT_APP_SETTINGS: AppSettings = {
	outputDirectoryMode: "Manifest ID",
	outputDirectoryName: "",
	noMobileAuth: false,
};


function App() {
	const username = useState<string>();
	const password = useState<string>();
	const appId = useState<string>();
	const depotId = useState<string>();
	const manifestId = useState<string>();
	const outputLocation = useState<string>();
	const downloading = useState<boolean>();
	const showSettings = useState<boolean>();
	const appSettings = useState<AppSettings>(DEFAULT_APP_SETTINGS);
	
	
	return (
		<AppContext.Provider
			value={{
				username,
				password,
				appId,
				depotId,
				manifestId,
				outputLocation,
				downloading,
				showSettings,
				appSettings,
			}}
		>
			<main class="absolute top-0 right-0 bottom-0 left-0 p-px text-white select-none bg-[#0d1117]">
				{showSettings[0]
					?<Settings />
					: <>
						<div class="mb-1 text-4xl font-bold text-center text-white font-['Hubot_Sans']">
							Steam Depot Downloader
						</div>

						<div class="flex gap-5 justify-between max-h-screen">
							<div class="pl-3 w-full max-w-1/2">
								<DownloaderForm />
							</div>
							<div class="pr-3 w-full max-w-1/2">
								<DownloaderOutput />
							</div>
						</div>
					</>
				}
				<button tabIndex={-1} type="button" onClick={() => { openUrl(`https://github.com/mmvanheusden/SteamDepotDownloaderGUI/releases/v${appVersion}`).catch((e) => console.error(e)); }} class="absolute right-0 bottom-0 text-white hover:underline">{`v${appVersion}`}</button>
			</main>
		</AppContext.Provider>
	);
}

export default App;

export async function startDownload(options: {
	username?: string;
	password?: string;
	appId: string;
	depotId: string;
	manifestId: string;
	outputLocation?: string;
	outputDirectoryName?: string;
	noMobileAuth: boolean;
}) {
	
	await invoke("download_depotdownloader"); // First make backend download DepotDownloader
	
	await invoke("start_download", {
		steamDownload: {
			...options
		}
	}); // First make backend download DepotDownloader
}
