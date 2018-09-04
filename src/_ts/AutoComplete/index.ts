import { Model } from "../Model/ModelClass";

class AutoComplete {
    private target: JQuery<HTMLElement>;
    private lookup: any;
    private element: JQuery<HTMLElement>;
    private model: Model;

    private funcOnChoose: (data: any) => any;
    private currentDataRow: any;
    private currentOffset: number;

    public constructor(target: string | JQuery<HTMLElement>, model: Model) {
        if (typeof target === "string") {
            this.target = $("#" + target);
        } else {
            this.target = target;
        }
        this.target.attr("autocomplete", "off");
        this.model = model;
    }

    public onChoose(func: (data) => any) {
        this.funcOnChoose = func;
    }

    public isShowed() {
        return this.element.children.length > 0;
    }

    /**
     * set fieldname to show
     * @param lookup {fieldName: ElementId}
     */
    public setLookup(lookup) {
        this.lookup = lookup;
    }

    public listen() {
        this.target.on("keyup", (e: JQuery.Event) => {
            const key = e.key;
            switch (key) {
                case "Enter": {
                    break;
                }
                case "Escape": {
                    this.remove();
                    break;
                }
                case "ArrowUp": {
                    // to do
                    break;
                }
                case "ArrowDown": {
                    // to do
                    break;
                }
                default: {
                    const val = this.target.val();
                    this.remove();
                    this.render(val).then(() => {
                        this.show();
                    });
                }
            }
        });
    }

    public async render(search) {
        this.element = $("<ul/>").addClass("my-autocomplete shadow-lg rounded");
        this.element.css({
            top: this.target.offset().top + this.target.outerHeight(),
            left: this.target.offset().left,
        });
        const data = await this.getData(search);

        this.currentOffset = 0;
        let offset = 0;
        for (const dataRow of data) {
            const dataRowFiltered = this.filterDataWithLookup(dataRow);
            const rowElement = this.renderRow(dataRowFiltered, offset++);
            rowElement.on("click keydown", (e: JQuery.Event) => {
                if (e.type === "click" || e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    this.funcOnChoose(dataRow);
                    this.remove();
                }
            });
            this.element.append(rowElement);
        }
    }

    public show() {
        $("body").append(this.element);
    }

    public remove() {
        $(".my-autocomplete").remove();
    }

    public async getData(search) {
        const data = await this.model.get(search, 0, 20); // 20 is for test first, will develop in future
        return data;
    }

    protected renderRow(dataRow: any, offset: number) {
        const row = $("<li/>").data("offset", offset);
        for (const field of Object.keys(dataRow)) {
            const val = dataRow[field];
            row.append($("<div/>").text(val));
        }

        return row;
    }

    protected filterDataWithLookup(dataRow) {
        const filteredData = {};
        for (const key of this.lookup) {
            if (dataRow.hasOwnProperty(key)) {
                filteredData[key] = dataRow[key];
            }
        }
        return filteredData;
    }
}

export {AutoComplete};
