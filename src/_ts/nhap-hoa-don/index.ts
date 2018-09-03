import { AutoComplete } from "../AutoComplete";
import { App } from "../App";

function init(app: App) {
    const autocomplete = new AutoComplete("nhap_hoa_don--ten_thuoc", app.thuoc);
    autocomplete.setLookup(["ma", "ten", "ncc"]);
    autocomplete.listen();
    autocomplete.onChoose((data) => {
        //
    });
}

export {init};
