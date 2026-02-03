import {useState} from "preact/hooks";
import "./css/App.css";
import {DownloaderOutput} from "./components/DownloaderOutput.tsx";
import {DownloaderForm} from "./components/DownloaderForm.tsx";
import {AppContext} from "./context.ts";
import {invoke} from "@tauri-apps/api/core";

function App() {
	const username = useState<string>();
	const password = useState<string>();
	const appId = useState<number>();
	const depotId = useState<number>();
	const manifestId = useState<number>();
	const outputLocation = useState<string>();
	

	return (
		<AppContext.Provider
			value={{
				username,
				password,
				appId,
				depotId,
				manifestId,
				outputLocation,
			}}
		>
			<main class="bg-gray-800 left-0 top-0 bottom-0 absolute right-0 select-none p-px">
				<div class="text-white font-bold text-4xl text-center mb-1 font-['Hubot_Sans']">
					Steam Depot Downloader
				</div>

				<div class="flex justify-between gap-5">
					<div class="w-full max-w-1/2 pl-3">
						<DownloaderForm />
					</div>
					<div class="w-full max-w-1/2 pr-3">
						<DownloaderOutput />
					</div>
				</div>
			</main>
		</AppContext.Provider>
	);
}

export default App;

export async function startDownload(options: {
	username?: string;
	password?: string;
	appId: number;
	depotId: number;
	manifestId: number;
	outputLocation?: string;
	outputDirectoryName?: string;
}) {
	
	await invoke("download_depotdownloader"); // First make backend download DepotDownloader
	
	// BLOCK INTERFACE & CLEARING TERMINAL
	
	await invoke("start_download", {
		steamDownload: options
	}); // First make backend download DepotDownloader
	
	
	// UNBLOCK INTERFACE & CLEARING TERMINAL
	
}
