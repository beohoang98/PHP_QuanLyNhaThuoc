import { Thuoc } from "../Model/Thuoc";
import { ViewTable } from "./ViewTable";

class ThuocTable extends ViewTable {

    public constructor() {
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

        this.model = new Thuoc();
    }
}

export {ThuocTable};
