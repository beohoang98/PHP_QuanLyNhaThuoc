"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AutoComplete_1 = require("../AutoComplete");
function init(app) {
    const autocomplete = new AutoComplete_1.AutoComplete("nhap_hoa_don--ten_thuoc", app.thuoc);
    autocomplete.setLookup(["ma", "ten", "ncc"]);
    autocomplete.listen();
    autocomplete.onChoose((data) => {
        //
    });
}
exports.init = init;
//# sourceMappingURL=index.js.map