import {useContext} from "preact/hooks";
import "../css/App.css";
import {NumberInput, TextInput} from "./FormInput";
import {startDownload} from "../App";
import {Icon} from "@iconify-icon/react";
import {AppContext} from "../context";

export function DownloaderForm() {
	const context = useContext(AppContext);
	return (
		<>
			<form>
				<div class="gap-1">
					<TextInput label="Username" valueState={context.username!} />
					<TextInput label="Password" valueState={context.password!} password={true} />
					<br />
					<NumberInput label="App ID" valueState={context.appId!} required={true} />
					<NumberInput label="Depot ID" valueState={context.depotId!} required={true} />
					<NumberInput label="Manifest ID" valueState={context.manifestId!} required={true} />
					<br />
					<DownloadButton disabled={false} downloading={false} />
					<br />
				</div>
			</form>
			<div class="flex justify-between gap-1">
				<InternetButton icon={"ic:sharp-discord"} title="Discord" />
				<InternetButton icon={"simple-icons:steamdb"} title="SteamDB" href="https://steamdb.info/instantsearch/" />
				<InternetButton icon={"mdi:youtube"} title="Tutorials" href=""/>
				<InternetButton icon={"bx:donate-heart"} title="Donate" href=""/>
			</div>
		</>
	);
}


function DownloadButton(
	{disabled, downloading}: {disabled?: boolean, downloading?: boolean}
) {
	const context = useContext(AppContext);
	const onClick = (e: MouseEvent) => {
		const form: HTMLFormElement = (e.target as HTMLButtonElement).closest("form")!;
    
		e.preventDefault(); // Block refreshing the page
    
		form.reportValidity(); // Display native form validation
    
		if (!form.checkValidity()) {
			console.warn("Form invalid!");
			return;
		}
		console.trace(context);
		startDownload();
	};
  
	return (
		<button disabled={disabled} onClick={onClick} type="submit" class="w-full bg-green-500 rounded-md border py-1.5 font-semibold text-xl hover:bg-green-600 active:bg-green-700 active:scale-103 transition-transform disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center">
			{downloading ? "Downloading..." : <><Icon icon="material-symbols:download" />Download</>}
		</button>
	);
}

function InternetButton(
	{title, icon, href, disabled}: {title: string, icon: string, href?: string, disabled?: boolean}
) {
	const onClick = (e: MouseEvent) => {
		// go to url
	};
  
	return (
		<button disabled={disabled} onClick={onClick} class="grow px-0 bg-gray-500 rounded-md border py-0.5 font-semibold text-md hover:bg-gray-400 active:bg-gray-300 active:scale-103 transition-transform disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center">
			<Icon icon={icon} />{title}
		</button>
	);
}