import {useContext, useState} from "preact/hooks";
import "../css/App.css";
import {BooleanUseState, FileInput, NumberInput, TextInput} from "./FormInput";
import {startDownload} from "../App";
import {Icon} from "@iconify-icon/react";
import {AppContext} from "../context";
import {openUrl} from "@tauri-apps/plugin-opener";

export function DownloaderForm() {
	const downloading = useState<boolean>();
	const context = useContext(AppContext);
	
	return (
		<>
			<form>
				<div class="flex flex-col gap-0.5 mb-2">
					<TextInput label="Username" valueState={context.username!} />
					<TextInput label="Password" valueState={context.password!} password={true} />
					<br />
					<NumberInput label="App ID" valueState={context.appId!} required={true} />
					<NumberInput label="Depot ID" valueState={context.depotId!} required={true} />
					<NumberInput label="Manifest ID" valueState={context.manifestId!} required={true} />
					<FileInput label="Manifest ID" valueState={context.manifestId!} required={true} pathState={context.outputLocation!} />
					<br />
					<DownloadButton disabled={downloading[0]} downloadingState={downloading} />
				</div>
			</form>
			<div class="flex justify-between gap-1">
				<InternetButton icon={"ic:sharp-discord"} title="Discord" href="https://discord.com/invite/3qCt4DT5qe" />
				<InternetButton icon={"simple-icons:steamdb"} title="SteamDB" href="https://steamdb.info/instantsearch" />
				<InternetButton icon={"mdi:youtube"} title="Tutorials" href="https://youtube.com/playlist?list=PLRAjc5plLScj967hnsYX-I3Vjw9C1v7Ca"/>
				<InternetButton icon={"bx:donate-heart"} title="Donate" href="https://paypal.me/onderkin"/>
			</div>
		</>
	);
}


function DownloadButton(
	{disabled, downloadingState}: {disabled?: boolean, downloadingState: BooleanUseState}
) {
	const [downloading, setDownloading] = downloadingState;
	const context = useContext(AppContext);
	const onClick = (e: MouseEvent) => {
		const form: HTMLFormElement = (e.target as HTMLButtonElement).closest("form")!;
    
		e.preventDefault(); // Block refreshing the page
    
		form.reportValidity(); // Display native form validation
    
		if (!form.checkValidity()) {
			console.warn("Form invalid!");
			return;
		}
		setDownloading(true)
		startDownload({
			username: context.username![0],
			password: context.password![0],
			appId: context.appId![0]!,
			depotId: context.depotId![0]!,
			manifestId: context.manifestId![0]!,
			outputLocation: context.outputLocation![0]!,
		}).catch((e) => console.error(e));
		// setDownloading(false)
	};
  
	return (
		<button disabled={disabled} onClick={onClick} type="submit" class="w-full bg-green-500 rounded-md border py-1.5 font-semibold text-xl hover:bg-green-600 active:bg-green-700 active:scale-103 transition disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-start">
			{downloading
				? <>
					<div class="justify-start ml-5 items-center flex">
						<Icon icon="line-md:downloading-loop" width="35" height="35" />
					</div>
					<span class="w-full">Downloading...</span>

				</> :
				<>
					<div class="justify-start ml-5 items-center flex">
						<Icon icon="material-symbols:downloading-rounded" width="35" height="35" />
					</div>
					<span class="w-full">Download</span>
				</>
			}
		</button>
	);
}

function InternetButton(
	{title, icon, href, disabled}: {title: string, icon: string, href?: string, disabled?: boolean}
) {
	const onClick = () => {
		if (href) openUrl(href).catch((e) => console.error(e));
	};
  
	return (
		<button disabled={disabled} onClick={onClick} type="button" class="grow gap-px px-1 bg-gray-500 rounded-md border py-0.5 font-semibold text-md hover:bg-gray-400 active:bg-gray-300 active:scale-103 transition-transform disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center">
			<Icon icon={icon} />{title}
		</button>
	);
}