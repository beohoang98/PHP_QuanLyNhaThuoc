"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./Controller");
const inputPreview2_1 = require("./inputPreview2");
const _QLNT = class extends Controller_1.Controller {
    constructor() {
        super();
        this.addModel('DonVi', 'DonVi');
        this.addModel('Thuoc', 'Thuoc');
        this.addModel('Nsx', 'Nsx');
    }
    addTable(element) {
        let nameTHs = element.querySelectorAll("th");
        let compoName = element.getAttribute('component');
        const lookName = Array.from(nameTHs).map((val) => val.getAttribute('for'));
        const updateTable = function (err, data) {
            if (err)
                return;
            let body = element.querySelector('tbody');
            // delete old row
            while (body.lastChild)
                body.removeChild(body.lastChild);
            // updata new row
            for (let row of data) {
                let rowEl = document.createElement('tr');
                for (let name of lookName) {
                    let newTD = document.createElement('td');
                    newTD.textContent = row[name];
                    rowEl.appendChild(newTD);
                }
                body.appendChild(rowEl);
            }
        };
        this.addUpdateFunc(compoName, updateTable);
    }
    addNameInputThuoc(idElement, optListen, optChange) {
        const preview = new inputPreview2_1.default();
        preview.addLookup(optListen);
        preview.listen(idElement, (data) => {
            for (let idEl of Object.keys(optChange)) {
                const field = optChange[idEl];
                $('#' + idEl).val(data[field]);
            }
        });
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            preview.addData(data);
        };
        this.addUpdateFunc('Thuoc', onUpdate);
    }
    addSelectInput(element, opt) {
        const valueKey = opt.value;
        const titleKey = opt.title;
        const compoName = $(element).attr('component');
        const onUpdate = function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            // remove old options
            while (element.lastChild)
                element.removeChild(element.lastChild);
            // add updated option
            for (const row of data) {
                const newOpt = $("<option/>");
                newOpt.attr('value', row[valueKey])
                    .text(row[titleKey])
                    .appendTo(element);
            }
        };
        this.addUpdateFunc(compoName, onUpdate);
    }
};
exports.QLNT = _QLNT;
//# sourceMappingURL=App.js.map