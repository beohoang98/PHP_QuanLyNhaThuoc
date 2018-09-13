import { AutoComplete } from "../AutoComplete";
import { App } from "../App";
import { addThuocHandle } from "./addThuocHandle";
import { submitHoaDonHandle } from "./submitHoaDon";

function init(app: App) {
    addThuocHandle(app);
    submitHoaDonHandle(app);
}

export {init};
