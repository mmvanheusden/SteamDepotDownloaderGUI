import {createContext} from "preact";
import {NumberUseState, StringUseState} from "./components/FormInput";

interface AppContext {
  username: StringUseState;
  password: StringUseState;
  appId: NumberUseState;
  depotId: NumberUseState;
  manifestId: NumberUseState;
}

export const AppContext = createContext<Partial<AppContext>>({});