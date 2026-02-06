import { Icon } from "@iconify-icon/react";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { openPath } from "@tauri-apps/plugin-opener";
import { useState } from "preact/hooks";
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


export function TextInput({ id, label, placeholder, valueState, initialValue, required, password, disabled, className, onInput }: { id: string, label?: string, placeholder?: string, valueState?: StringUseState, required?: boolean, password?: boolean, disabled?: boolean, className?: string, initialValue?: string, onInput?: (newValue: string) => void }) {
	if (initialValue !== undefined && valueState) {
		console.error("Initial value and value state both defined. Please only define one.");
		return null;
	} else if (initialValue === undefined && !valueState) {
		console.error("No initial value or value state defined. Please define one.");
		return null;
	}

	let value: string;
	let setValue: ((v: string) => void) | undefined;

	if (valueState) {
		const [v, s] = valueState;
		value = v!;
		setValue = s as (v: string) => void;
	} else {
		value = initialValue!;
	}

	const handleInput = (e: Event) => {
		const newChecked = (e.currentTarget as HTMLInputElement).value;
		if (setValue) {
			setValue(newChecked);
		}
		if (onInput) {
			onInput(newChecked);
		}
	};
  
	return (
		<>
			{label && <Label forId={id} text={label} required={required} />}
			<input disabled={disabled} id={id} required={required} value={value} onInput={handleInput} placeholder={placeholder} type={password ? "password" : "text"} class={`block py-2 px-3 w-full text-sm placeholder-gray-400 text-white rounded-lg border border-gray-600 transition duration-300 focus:border-blue-500 disabled:placeholder-white disabled:bg-gray-700 bg-[#161b22] focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)] ${className} `} />
		</>
	);
}

export function NumberInput({ id, label, placeholder, valueState, initialValue, required, min, max, step, disabled, onInput }: { id: string, label?: string, placeholder?: string, valueState?: StringUseState, initialValue?: string, required?: boolean, min?: number, max?: number, step?: number, disabled?: boolean, onInput?: (newValue: string) => void }) {
	if (initialValue !== undefined && valueState) {
		console.error("Initial value and value state both defined. Please only define one.");
		return null;
	} else if (initialValue === undefined && !valueState) {
		console.error("No initial value or value state defined. Please define one.");
		return null;
	}

	let value: string;
	let setValue: ((v: string) => void) | undefined;

	if (valueState) {
		const [v, s] = valueState;
		value = v!;
		setValue = s as (v: string) => void;
	} else {
		value = initialValue!;
	}

	const handleInput = (e: Event) => {
		const newChecked = (e.currentTarget as HTMLInputElement).value;
		if (setValue) {
			setValue(newChecked);
		}
		if (onInput) {
			onInput(newChecked);
		}
	};
  
	return (
		<>
			{label && <Label forId={id} text={label} required={required} />}
			<input disabled={disabled} id={id} required={required} value={value} onInput={handleInput} min={min ?? 1} max={max} step={step} placeholder={placeholder} type="number" pattern="[0-9]" class="block py-2 px-3 w-full text-sm placeholder-gray-400 text-white rounded-lg border border-gray-600 transition duration-300 focus:border-blue-500 disabled:placeholder-white disabled:bg-gray-700 bg-[#161b22] focus:shadow-[0px_0px_29px_1px_rgba(59,130,246,0.5)]" />
		</>
	);
}

export function BooleanInput({ id, label, valueState, initialValue, required, disabled, className, onInput }: { id: string, label?: string, valueState?: BooleanUseState, required?: boolean, disabled?: boolean, className?: string, onInput?: (newValue: boolean) => void, initialValue?: boolean}) {
	if (initialValue !== undefined && valueState) {
		console.error("Initial value and value state both defined. Please only define one.");
		return null;
	} else if (initialValue === undefined && !valueState) {
		console.error("No initial value or value state defined. Please define one.");
		return null;
	}

	let checked = false;
	let setValue: ((v: boolean) => void) | undefined;

	if (valueState) {
		const [v, s] = valueState;
		checked = Boolean(v);
		setValue = s as (v: boolean) => void;
	} else {
		checked = Boolean(initialValue);
	}

	const handleInput = (e: Event) => {
		const newChecked = (e.currentTarget as HTMLInputElement).checked;
		if (setValue) {
			setValue(newChecked);
		}
		if (onInput) {
			onInput(newChecked);
		}
	};

	return (
		<>
			{label && <Label forId={id} text={label} required={required} />}
			<input disabled={disabled} id={id} required={required} checked={checked} onInput={handleInput} type="checkbox" class={`w-4 h-4 rounded-sm focus:ring-blue-600 ring-offset-gray-800 focus:ring-2 bg-gray-700 border-gray-600 ${className ?? ""}`}
			/>
		</>
	);
}

export function FileInput({ required, pathState, disabled, label }: { required?: boolean, pathState: StringUseState, disabled?: boolean, label?: string }) {
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
			{label && <Label text={label} required={required} />}
			<div className="flex gap-2 justify-start w-2/3">
				<button disabled={disabled} type="button" onClick={selectPath}
					className="inline-flex gap-2 justify-center items-center py-1 px-2 font-medium text-white rounded-md border border-gray-600 transition-transform disabled:cursor-not-allowed grow bg-blue-900/90 text-md enabled:active:scale-103 hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="subway:folder-2" height="25" width="25" />Choose
				</button>
				<input required={required} type="text" hidden
					   value={path}></input> {/* A hidden text input which holds the path useState value, so the form will be invalid when no path is selected. */}
				<button type="button" disabled={!path} onClick={() => {if (path) previewPath(); }}
					className="inline-flex gap-2 justify-center items-center py-1 px-2 font-medium text-white rounded-md border border-gray-600 transition-transform disabled:cursor-not-allowed grow bg-blue-900/90 text-md enabled:active:scale-103 hover:bg-blue-900/65 active:bg-blue-900/40 disabled:bg-red-500/70">
					<Icon icon="material-symbols:folder-eye" height="25" width="25" />Preview
				</button>
			</div>
		</>

	);
}