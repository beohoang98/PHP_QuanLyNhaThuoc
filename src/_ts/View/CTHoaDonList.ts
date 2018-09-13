import { ViewTable } from "./ViewTable";
import { App } from "../App";
import { CTHoaDon } from "../Model/HoaDon/CTHoaDon";
import { MenuContext } from "../MenuContext";
import { HoaDon } from "../Model/HoaDon";

class CTHoaDonList extends ViewTable {
    private funcOnDelete;

    constructor(hoaDonModel: HoaDon) {
        super();
        this.element = $("<table/>").addClass("table table-striped table-view");
        this.element.html(`
        <thead>
            <tr>
                <th>Ma Thuoc</th>
                <th>Ten Thuoc</th>
                <th>Don Gia</th>
                <th>So Luong</th>
                <th>Thanh tien</th>
            </tr>
        </thead>
        <tbody></tbody>
        `);

        this.model = hoaDonModel;
        this.funcOnDelete = (data) => {return; };
    }

    public onDelete(func = (data) => {return; }) {
        this.funcOnDelete = func;
    }

    protected customCreateRow(row) {
        const ctx = new MenuContext(row);
        ctx.addContext({
            title: "Delete",
            icon: "fa fa-times",
            className: "danger",
            click: () => {
                this.funcOnDelete(this.model.fetchData);
            },
        });
    }
}

export { CTHoaDonList };
