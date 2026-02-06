import { createContext } from "preact";
import { SetStateAction } from "preact/compat";
import { Dispatch, useState } from "preact/hooks";
import { BooleanUseState, StringUseState } from "./components/FormInput";


// Source: https://stackoverflow.com/a/75420688
type NoUndefinedState<T> =
    T extends [infer S | undefined, Dispatch<SetStateAction<infer S | undefined>>]
    ? [S, Dispatch<SetStateAction<S>>]
	: never;

export interface AppSettings {
	outputDirectoryMode: "Manifest ID" | "Custom";
	outputDirectoryName?: string;
	noMobileAuth: boolean;
}


interface AppContext {
	username: StringUseState;
	password: StringUseState;
	appId: StringUseState;
	depotId: StringUseState;
	manifestId: StringUseState;
	outputLocation: StringUseState;
	downloading: BooleanUseState;
	showSettings: NoUndefinedState<BooleanUseState>;
	appSettings: NoUndefinedState<ReturnType<typeof useState<AppSettings>>>;
}

export const AppContext = createContext<Partial<AppContext>>({});