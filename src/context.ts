import {createContext} from "preact";
import {BooleanUseState, StringUseState} from "./components/FormInput";

interface AppContext {
	username: StringUseState;
	password: StringUseState;
	appId: StringUseState;
	depotId: StringUseState;
	manifestId: StringUseState;
	outputLocation: StringUseState;
	downloading: BooleanUseState
}

export const AppContext = createContext<Partial<AppContext>>({});