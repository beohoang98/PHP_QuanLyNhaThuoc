import { Model } from "../Model/ModelClass";

class ViewTable {
    protected model: Model;
    protected element: JQuery<any>;
    protected offset: number;
    protected limit: number;
    protected data: any;

    // function var
    protected funcOnChoose: (data: any) => any;
    protected funcOnFocus: (data: any) => any;

    public constructor() {
        // construct
    }

    /**
     * get data with search value
     * @param search field=value
     */
    public async update(search) {
        // render data to element
        const rawData = await this.model.get({}, this.offset, this.limit);
        this.data = Array.from(rawData).map((val) => {
            return this.filterDataRow(val);
        });
        return this.data;
    }

    public async render(search: string) {
        const data = await this.update(search);
        const tbody = this._createTableBody(data);
        this.element.find("tbody").html(tbody.html());
    }

    public getElement() {
        return this.element;
    }

    public onChoose(callback: (data) => any) {
        this.funcOnChoose = callback;
    }

    public onFocus(callback: (data) => any) {
        this.funcOnFocus = callback;
    }

    protected filterDataRow(dataRow) {
        // nothing here, just raw
        return dataRow;
    }

    protected _createRow(dataRow) {
        const row = $("<tr/>");
        for (const field of Object.keys(dataRow)) {
            const cell = $("<td/>").attr("name", field).text(dataRow[field]);
            row.append(cell);
        }
        row.on("click", (e: JQuery.Event) => {
            this.funcOnChoose(dataRow);
        });
        row.on("hover", (e: JQuery.Event) => {
            this.funcOnFocus(dataRow);
        });

        return row;
    }

    protected _createTableBody(data) {
        const tbody = $("<tbody/>");
        for (const rowData of data) {
            const trow = this._createRow(rowData);
            tbody.append(trow);
        }
        return tbody;
    }
}

export {ViewTable};
