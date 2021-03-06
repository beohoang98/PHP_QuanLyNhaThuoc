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
    protected currentRowData;

    public constructor() {
        // construct
        this.offset = 0;
        this.limit = 10;
    }

    /**
     * get data with search value
     * @param search field=value
     */
    public async update(search) {
        // render data to element
        const rawData = await this.model.get(search, this.offset, this.limit);
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
        this.element.find("tbody").html("").append(tbody.children());
    }

    public setElement(el: JQuery<HTMLElement>) {
        this.element = el;
    }
    public getElement() {
        return this.element;
    }
    public currentData() {
        if (!this.currentRowData) {
            return undefined;
        }
        return Object.assign({}, this.currentRowData);
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

    public selectDown() {
        if (this.currentPos < this.sizeOfRecord - 1) {
            ++this.currentPos;
        }
        this.element.find(`tr[data-pos=${this.currentPos}]`).focus();
    }
    public selectUp() {
        if (this.currentPos > 0) {
            --this.currentPos;
        }
        this.element.find(`tr[data-pos=${this.currentPos}]`).focus();
    }

    public nextPage(search: string = "") {
        this.offset += this.limit;
        this.render(search);
    }

    public setLimitPerPage(limit: number) {
        this.limit = limit;
    }

    public setOffset(offset: number) {
        this.offset = offset;
    }

    protected filterDataRow(dataRow: any): any {
        // nothing here, just raw
        return dataRow;
    }

    protected _createRow(dataRow, pos): JQuery<HTMLElement> {
        const row = $("<tr/>").attr("tabindex", -1).attr("data-pos", pos);
        for (const field of Object.keys(dataRow)) {
            const cell = $("<td/>").attr("name", field).text(dataRow[field]);
            row.append(cell);
        }

        // choose event
        this._rowOnChoose(row, () => {
            this.funcOnChoose(dataRow);
        });

        // hover event
        row.on("click focus", (e: JQuery.Event) => {
            this.element.find("tr").removeClass("active");
            row.addClass("active");

            this.currentPos = pos;
            this.currentRowData = dataRow;
            this.funcOnFocus(dataRow);
        });

        this.customCreateRow(row);

        return row;
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

    protected customCreateRow(row: JQuery<HTMLElement>) {
        // nothing here, will change in inheritance
    }

    private _rowOnChoose(row, callback) {
        row.on("keydown", (e: JQuery.Event) => {
            if (e.keyCode === 13) {
                callback();
            }
        });
        row.on("dblclick", () => {
            callback();
        });
    }
}

export {ViewTable};
