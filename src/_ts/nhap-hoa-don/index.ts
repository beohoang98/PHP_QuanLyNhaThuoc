import { AutoComplete } from "../AutoComplete";
import { App } from "../App";
import { addThuocHandle } from "./addThuocHandle";

function init(app: App) {
    addThuocHandle(app);
}

export {init};
