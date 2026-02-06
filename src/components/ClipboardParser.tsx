import { readText } from "@tauri-apps/plugin-clipboard-manager";
import { useContext, useState } from "preact/hooks";
import { AppContext } from "../context";
import { Icon } from "@iconify-icon/react";

export function ClipBoardParserButton({disabled}: {disabled: boolean}) {
	const context = useContext(AppContext);
	const [modal, setModal] = useState(false);
	
	const appRe = /-app\s+(\d+)/i;
	const depotRe = /-depot\s+(\d+)/i;
	const manifestRe = /-manifest\s+(\d+)/i;	
	
	const process = async () => {
		const content: string = await readText();
		
		const appMatch = appRe.exec(content);
		const depotMatch = depotRe.exec(content);
		const manifestMatch = manifestRe.exec(content);
		
		if (appMatch && depotMatch && manifestMatch) {
			context.appId![1](appMatch[1]);
			context.depotId![1](depotMatch[1]);
			context.manifestId![1](manifestMatch[1]);
		} else {
			alert("Clipboard doesn't contain valid content.\nAn example of valid content is: -app 346900 -depot 346903 -manifest 1203243898820547407");
		}
	};
	
	return (
		<div class={`${(disabled && !modal) && "active:scale-102"}`}>
			<div hidden={!modal} onClick={(e: MouseEvent) => { e.stopPropagation(); setModal(false); }} class="flex fixed top-0 left-0 z-10 items-center w-1/2 h-full">
				<div class="flex flex-col py-3 px-2 mx-auto max-w-sm rounded-md -translate-y-8 bg-blue-950">
					<p class="mb-3 text-2xl font-semibold underline underline-offset-4">Clipboard autofill instructions</p>
					<p>On SteamDB on the manifest overview page, there is a possibility to set the <i>copy format</i>.</p>
					<img src="../../assets/steamdb_copy.png" />
					<p>
						When set to DepotDownloader, SteamDepotDownloaderGUI can parse this from the clipboard,
						and auto-fill into the form.
					</p>
				</div>
			</div>
			<div class="flex">
				{/* https://stackoverflow.com/a/73923373 */}
				<button disabled={disabled} onClick={() => void process()} type="button" class="inline-flex items-center py-1 px-2 font-medium text-white rounded-l-md border border-r-0 border-gray-600 transition-transform disabled:cursor-not-allowed rounded-e-0 bg-blue-900/90 text-md hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="mdi:clipboard-text-search" width="25" height="25" />Auto-fill
				</button>
				<button onClick={() => setModal(true)} type="button" class="inline-flex items-center py-1 px-2 font-medium text-white rounded-r-md border border-r-0 border-gray-600 transition-transform disabled:cursor-not-allowed rounded-e-0 bg-blue-900/90 text-md hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="material-symbols:help" width="25" height="25" />
				</button>
			</div>
			
		</div>
	);
}