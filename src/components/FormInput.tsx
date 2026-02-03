import {Icon} from "@iconify-icon/react";
import {useState} from "preact/hooks";
import {open as openDialog} from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import "../css/App.css";

export type StringUseState = ReturnType<typeof useState<string>>;
export type NumberUseState = ReturnType<typeof useState<number>>;
export type BooleanUseState = ReturnType<typeof useState<boolean>>;


export function TextInput({ id, label, placeholder, valueState, required, password, disabled }: { id: string, label?: string, placeholder?: string, valueState: StringUseState, required?: boolean, password?: boolean, disabled?: boolean }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			{label &&
				<label for={id} class={`text-md font-medium text-white ${required && "after:content-['*'] after:ml-1 after:text-xl  after:text-red-500"}`}>
					{label}
				</label>
			}
			<input disabled={disabled} id={id} required={required} value={value} onInput={onInput} placeholder={placeholder} type={password ? "password": "text"} class="border text-sm rounded-lg block w-full bg-[#161b22] border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_-10px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300 disabled:bg-gray-700 disabled:placeholder-white disabled:line-through" />
		</>
	);
}

export function NumberInput({ id, label, placeholder, valueState, required, min, max, step }: { id: string, label: string, placeholder?: string, valueState: StringUseState, required?: boolean, min?: number, max?: number, step?: number }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			<label for={id} class={`text-md font-medium text-white ${required && "after:content-['*'] after:ml-1 after:text-xl  after:text-red-500"}`}>
				{label}
			</label>
			<input id={id} required={required} value={value} onInput={onInput} min={min ?? 1} max={max} step={step} placeholder={placeholder} type={"number"} class="border text-sm rounded-lg block w-full bg-[#161b22] border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_-10px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300" />
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
		<div class="flex justify-between gap-2">
			<button type="button" onClick={selectPath} class="text-white border-black grow px-px bg-gray-500 rounded-md border py-1 font-semibold text-md hover:bg-gray-400 active:bg-gray-300 active:scale-103 transition-transform disabled:bg-red-500/70 disabled:pointer-events-none inline-flex items-center justify-center gap-1">
				<Icon icon="subway:folder-2" />Choose output directory
			</button>
			<input required={required} type="text" hidden value={path}></input> {/* A hidden text input which holds the path useState value, so the form will be invalid when no path is selected. */}
			<button type="button" disabled={!path} onClick={previewPath} class=" text-white border-black grow px-px bg-gray-500 rounded-md border py-1 font-semibold text-md hover:bg-gray-400 active:bg-gray-300 enabled:active:scale-103 transition-transform disabled:bg-red-500/70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1">
				<Icon icon="material-symbols:folder-eye" />Preview output directory
			</button>
		</div>
	);
}