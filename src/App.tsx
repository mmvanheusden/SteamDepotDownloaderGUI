import {useState} from "preact/hooks";
import "./css/App.css";
import {DownloaderOutput} from "./components/DownloaderOutput.tsx";
import {DownloaderForm} from "./components/DownloaderForm.tsx";
import {AppContext, AppSettings} from "./context.ts";
import {invoke} from "@tauri-apps/api/core";
import {Settings} from "./components/Settings.tsx";

function App() {
	const username = useState<string>();
	const password = useState<string>();
	const appId = useState<string>();
	const depotId = useState<string>();
	const manifestId = useState<string>();
	const outputLocation = useState<string>();
	const outputFolderName = useState<string>();
	const downloading = useState<boolean>();
	const showSettings = useState<boolean>();
	const appSettings = useState<AppSettings>({
		// Settings defaults are defined here.
		outputDirectoryMode: "Manifest ID"
	});
	
	

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
				outputFolderName,
				appSettings,
			}}
		>
			<main class="absolute top-0 right-0 bottom-0 left-0 p-px select-none bg-[#0d1117]">
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
}) {
	
	await invoke("download_depotdownloader"); // First make backend download DepotDownloader
	
	// BLOCK INTERFACE & CLEARING TERMINAL
	
	await invoke("start_download", {
		steamDownload: {
			...options,
			outputDirectoryName: options.outputDirectoryName == "" ? null : options.outputDirectoryName, // empty string becomes null.
		}
	}); // First make backend download DepotDownloader
	
	
	// UNBLOCK INTERFACE & CLEARING TERMINAL
	
}
