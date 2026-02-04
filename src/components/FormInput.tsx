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


export function TextInput({ id, label, placeholder, valueState, required, password, disabled, className }: { id: string, label?: string, placeholder?: string, valueState: StringUseState, required?: boolean, password?: boolean, disabled?: boolean, className?: string }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			{label && <Label forId={id} text={label} required={required} />}
			<input disabled={disabled} id={id} required={required} value={value} onInput={onInput} placeholder={placeholder} type={password ? "password" : "text"} class={`block py-2 px-3 w-full text-sm placeholder-gray-400 text-white rounded-lg border border-gray-600 transition duration-300 focus:border-blue-500 disabled:placeholder-white disabled:bg-gray-700 bg-[#161b22] focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)] ${className} `} />
		</>
	);
}

export function NumberInput({ id, label, placeholder, valueState, required, min, max, step, disabled }: { id: string, label: string, placeholder?: string, valueState: StringUseState, required?: boolean, min?: number, max?: number, step?: number, disabled?: boolean }) {
	const [value, setValue] = valueState;
	const onInput = (e: Event) => {
		const newVal: string = (e.currentTarget as HTMLInputElement).value;
		// // https://stackoverflow.com/a/73143643
		// if (!(!isNaN(parseFloat(newVal)) && !isNaN(+newVal))) { // Check if new value is a number
		// 	console.warn("Not a number!")
		// 	e.preventDefault();
		// 	return;
		// }
		
		setValue(newVal);
	};
  
	return (
		<>
			<Label forId={id} text={label} required={required} />
			<input disabled={disabled} id={id} required={required} value={value} onInput={onInput} min={min ?? 1} max={max} step={step} placeholder={placeholder} type="number" pattern="[0-9]" class="block py-2 px-3 w-full text-sm placeholder-gray-400 text-white rounded-lg border border-gray-600 transition duration-300 focus:border-blue-500 disabled:placeholder-white disabled:bg-gray-700 bg-[#161b22] focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)]" />
		</>
	);
}

export function FileInput({ required, pathState, disabled }: { required?: boolean, pathState: StringUseState, disabled?: boolean }) {
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
			<div className="flex gap-2 justify-start w-2/3">
				<button disabled={disabled} type="button" onClick={selectPath}
					className="inline-flex gap-2 justify-center items-center py-1 px-2 font-medium text-white rounded-md border border-gray-600 shadow-2xl transition-transform disabled:cursor-not-allowed grow bg-blue-900/90 text-md enabled:active:scale-103 hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="subway:folder-2" height="25" width="25" />Choose
				</button>
				<input required={required} type="text" hidden
					   value={path}></input> {/* A hidden text input which holds the path useState value, so the form will be invalid when no path is selected. */}
				<button type="button" disabled={!path} onClick={() => {if (path) previewPath(); }}
					className="inline-flex gap-2 justify-center items-center py-1 px-2 font-medium text-white rounded-md border border-gray-600 shadow-2xl transition-transform disabled:cursor-not-allowed grow bg-blue-900/90 text-md enabled:active:scale-103 hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="material-symbols:folder-eye" height="25" width="25" />Preview
				</button>
			</div>
		</>

	);
}