import {useContext} from "preact/hooks";
import {TextInput} from "./FormInput";
import {AppContext} from "../context";
import {Icon} from "@iconify-icon/react";

export function Settings() {
	const context = useContext(AppContext);
	const [settings, setSettings] = context.appSettings!;
	
	return (
		<>
			<div class="flex justify-center items-center w-2/3">
				<button onClick={() => context.showSettings![1](s => !s)} type="button" class="inline-flex absolute left-0 items-center py-1 px-2 ml-10 text-xl font-semibold text-white bg-green-600 rounded hover:bg-green-700 active:bg-green-800">
					<Icon icon="icon-park-solid:back" width="20" height="20"/>Back
				</button>
				<div class="mb-1 text-4xl font-bold text-center text-white font-['Hubot_Sans']">
					Settings
				</div>
			</div>
			<div class="px-[10%] w-2/3">
				<div>
					<div class="text-2xl font-semibold text-white">
						Directory name
					</div>
					<p class="mb-3 text-white text-nowrap">
						This is the name the folder DepotDownloader will download the game in.<br />
						It will be located in the chosen output directory.
					</p>
					<div class="flex gap-px mb-2 rounded-md shadow-xs">
						<button
							onClick={() => setSettings(oldSettings => { context.outputFolderName![1](""); return ({ ...oldSettings, outputDirectoryMode: "Manifest ID" }); })}
							type="button"
							class={`border-black px-3 py-2  border border-r-0 font-medium text-md disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center rounded-s-lg focus:z-10 focus:ring-2 text-white hover:text-white focus:ring-blue-500 focus:text-white ${settings?.outputDirectoryMode === "Manifest ID" ? "bg-blue-500 underline border-0 outline-gray-300 outline shadow-[0px_0px_29px_-8px_cornflowerblue] hover:bg-blue-600 active:bg-blue-700" : "hover:bg-blue-800 active:bg-blue-900 bg-blue-700"}`}>
							Manifest ID
					  </button>
						<button
							onClick={() => setSettings(oldSettings => ({ ...oldSettings, outputDirectoryMode: "Custom" }))}
							type="button"
							class={`border-black px-3 py-2  border border-l-0 font-medium text-md disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center rounded-e-lg focus:z-10 focus:ring-2 text-white hover:text-white focus:ring-blue-500 focus:text-white ${settings?.outputDirectoryMode === "Custom" ? "bg-blue-500 underline border-0 outline-gray-300 outline shadow-[0px_0px_29px_-8px_cornflowerblue] hover:bg-blue-600 active:bg-blue-700" : "hover:bg-blue-800 active:bg-blue-900 bg-blue-700"}`}>
							Custom
					  </button>
					</div>
					<TextInput disabled={settings?.outputDirectoryMode === "Manifest ID"} id="directoryName" placeholder="DepotDownloader output directory name" valueState={context.outputFolderName!} />
				</div>
			</div>
		</>
	);
}