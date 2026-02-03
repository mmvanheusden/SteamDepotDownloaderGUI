import {useState} from "preact/hooks";

export type StringUseState = ReturnType<typeof useState<string>>;
export type NumberUseState = ReturnType<typeof useState<number>>;


export function TextInput({ label, placeholder, valueState, required, password }: { label: string, placeholder?: string, valueState: StringUseState, required?: boolean, password?: bool }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue((e.currentTarget as HTMLInputElement).value);
  
	return (
		<>
			<label class={`text-md font-medium text-white ${required && "after:content-['*'] after:ml-1 after:text-xl  after:text-red-500"}`}>
				{label}
			</label>
			<input required={required} value={value} onInput={onInput} placeholder={placeholder} type={password ? "password": "text"} class="border text-sm rounded-lg block w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_-14px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300" />
		</>
	);
}

export function NumberInput({ label, placeholder, valueState, required, min, max, step }: { label: string, placeholder?: string, valueState: NumberUseState, required?: boolean, min?: number, max?: number, step?: number }) {
	const [value, setValue] = valueState;
	const onInput = (e: InputEvent) => setValue(parseInt((e.currentTarget as HTMLInputElement).value));
  
	return (
		<>
			<label class={`text-md font-medium text-white ${required && "after:content-['*'] after:ml-1 after:text-xl  after:text-red-500"}`}>
				{label}
			</label>
			<input required={required} value={value} onInput={onInput} min={min} max={max} step={step} placeholder={placeholder} type={"number"} class="border text-sm rounded-lg block w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:border-blue-500 focus:shadow-[0px_0px_29px_-14px_rgba(59,130,246,0.5)] px-3 py-2 transition duration-300" />
		</>
	);
}