import { Thuoc } from "../Model/Thuoc";
import { ViewTable } from "./ViewTable";
import { MenuContext } from "../MenuContext";

class ThuocTable extends ViewTable {
    protected funcCtxAdd: () => any;
    protected funcCtxEdit: () => any;
    protected funcCtxEditPrice: () => any;

    public constructor(thuocModel: Thuoc) {
        super();
        this.element = $("<table/>").addClass("table table-striped table-view");
        this.element.html(`
        <thead>
            <tr>
                <th>Ma Thuoc</th>
                <th>Ten Thuoc</th>
            </tr>
        </thead>
        <tbody></tbody>
        `);

        this.model = thuocModel;
    }

    public onContextAdd(func) {
        this.funcCtxAdd = func;
    }
    public onContextEdit(func) {
        this.funcCtxEdit = func;
    }
    public onContextEditPrice(func) {
        this.funcCtxEditPrice = func;
    }

    protected customCreateRow(row: JQuery<HTMLElement>) {
        const contextmenu = new MenuContext(row);
        contextmenu.addContext({
            title: "nhập thêm thuốc",
            className: "text-success",
            icon: "fas fa-plus-circle",
            click: (e) => {
                this.funcCtxAdd();
            },
        }).addContext({
            title: "sửa thông tin",
            className: "text-primary",
            icon: "fas fa-pen-square",
            click: (e) => {
                this.funcCtxEdit();
            },
        }).addContext({
            title: "chỉnh giá",
            icon: "fa fa-dollar-sign",
            click: (e) => {
                this.funcCtxEditPrice();
            },
        });
    }
}

export {ThuocTable};
