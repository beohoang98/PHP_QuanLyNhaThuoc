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

    // event control
    protected currentPos: number;
    protected sizeOfRecord: number;

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
        this.sizeOfRecord = this.data.length;
        this.currentPos = -1;

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

    /**
     * attach event of choose
     * @param callback callback function when the row of record is choosed
     */
    public onChoose(callback: (data) => any) {
        this.funcOnChoose = callback;
    }

    /**
     * attach event of hover
     * @param callback callback function when the row of record is hover on
     */
    public onFocus(callback: (data) => any) {
        this.funcOnFocus = callback;
    }

    protected filterDataRow(dataRow: any): any {
        // nothing here, just raw
        return dataRow;
    }

    protected _createRow(dataRow, pos): JQuery<HTMLElement> {
        const row = $("<tr/>").attr("tabindex", 0);
        for (const field of Object.keys(dataRow)) {
            const cell = $("<td/>").attr("name", field).text(dataRow[field]);
            row.append(cell);
        }

        // choose event
        this._rowOnChoose(row, () => {
            this.funcOnChoose(dataRow);
        });

        // hover event
        row.on("hover focus", (e: JQuery.Event) => {
            this.element.find("tbody > tr").removeClass("active");
            row.addClass("active");
            this.currentPos = pos;
            this.funcOnFocus(dataRow);
        });

        return row;
    }

    protected _createTableHead(titleArr) {
        //
    }

    protected _createTableBody(data): JQuery<HTMLElement> {
        const tbody = $("<tbody/>");
        let pos = 0;
        for (const rowData of data) {
            const trow = this._createRow(rowData, pos++);
            tbody.append(trow);
        }
        return tbody;
    }

    private _rowOnChoose(row, callback) {
        row.on("click", (e: JQuery.Event) => {
            callback();
        });
        row.on("keydown", (e: JQuery.Event) => {
            if (e.keyCode === 13) {
                callback();
            }
        });
    }
}

export {ViewTable};
