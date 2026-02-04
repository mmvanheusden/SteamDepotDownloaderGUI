import {Icon} from "@iconify-icon/react";
import {useState} from "preact/hooks";
import {open as openDialog} from "@tauri-apps/plugin-dialog";
import {openPath} from "@tauri-apps/plugin-opener";
import "../css/App.css";

export type StringUseState = ReturnType<typeof useState<string>>;
export type NumberUseState = ReturnType<typeof useState<number>>;
export type BooleanUseState = ReturnType<typeof useState<boolean>>;

export function Label({ forId, text, required }: { forId?: string, text: string, required?: boolean }) {
	return (
		<label for={forId} class={`text-md font-medium text-white ${required && "after:content-['*'] after:ml-1 after:text-xl  after:text-red-500"}`}>
			{text}
		</label>
	);
}


export function TextInput({ id, label, placeholder, valueState, required, password, disabled }: { id: string, label?: string, placeholder?: string, valueState: StringUseState, required?: boolean, password?: boolean, disabled?: boolean }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			{label && <Label forId={id} text={label} required={required} />}
			<input disabled={disabled} id={id} required={required} value={value} onInput={onInput} placeholder={placeholder} type={password ? "password": "text"} class="border text-sm rounded-lg block w-full bg-[#161b22] border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300 disabled:bg-gray-700 disabled:placeholder-white disabled:line-through" />
		</>
	);
}

export function NumberInput({ id, label, placeholder, valueState, required, min, max, step }: { id: string, label: string, placeholder?: string, valueState: StringUseState, required?: boolean, min?: number, max?: number, step?: number }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			<Label forId={id} text={label} required={required} />
			<input id={id} required={required} value={value} onInput={onInput} min={min ?? 1} max={max} step={step} placeholder={placeholder} type={"number"} class="border text-sm rounded-lg block w-full bg-[#161b22] border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300" />
		</>
	);
}

export function FileInput({ required, pathState }: { required?: boolean, pathState: StringUseState }) {
	const [path, setPath] = pathState;
	const selectPath = () => {
		openDialog({
			title: "Choose where to save the game download.",
			multiple: false,
			directory: true,
			canCreateDirectories: true,
		})
			.then((selectedPath) => {
				if (!selectedPath) {
					console.warn("Nothing selected, doing nothing.");
					return;
				}
				setPath(selectedPath);
			})
			.catch((e) => console.error(e));	
	};
	const previewPath = () => {
		openPath(path!).catch((e) => console.error(e));
	};
	
	
	return (
		<>
			<Label text="Output directory" required={required} />
			<div className="flex justify-start gap-2 w-2/3">
				<button type="button" onClick={selectPath}
					className="grow text-white border-gray-600 px-1 bg-blue-900/90 shadow-2xl rounded-md border py-1.5 font-medium text-md hover:bg-blue-900/65 active:bg-blue-900/40 enabled:active:scale-103 transition-transform disabled:bg-red-500/45 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
					<Icon icon="subway:folder-2" height="25" width="25" />Choose
				</button>
				<input required={required} type="text" hidden
					   value={path}></input> {/* A hidden text input which holds the path useState value, so the form will be invalid when no path is selected. */}
				<button type="button" disabled={!path} onClick={() => {if (path) previewPath(); }}
					className="grow text-white border-gray-600 px-1 bg-blue-900/90 shadow-2xl rounded-md border py-1.5 font-medium text-md hover:bg-blue-900/65 active:bg-blue-900/40 enabled:active:scale-103 transition-transform disabled:bg-red-500/45 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
					<Icon icon="material-symbols:folder-eye" height="25" width="25" />Preview
				</button>
			</div>
		</>

	);
}