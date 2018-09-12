interface IHoaDonCT {
    ma_thuoc: string;
    ten_thuoc: string;
    so_luong: number;
}

class HoaDonNhap  {
    private element: JQuery<HTMLElement>;
    private data: IHoaDonCT[];
    private current: IHoaDonCT;

    public constructor(target: string | JQuery<HTMLElement>) {
        this.setView(target);
        this.updateTable();
    }

    public setView(target: string | JQuery<HTMLElement>) {
        if (typeof(target) === "string") {
            this.element = $("#" + target);
        } else {
            this.element = target;
        }
    }

    public updateTable(): void {
        this.element.find("tbody").remove();
        this.element.append(this.renderTable());
    }

    public newHoaDon() {
        this.data = [];
        this.updateTable();
    }

    public addHoaDon(cthd: IHoaDonCT) {
        this.data.push(cthd);
        this.element.append(this.renderRow(cthd));
    }

    protected renderTable(): JQuery<HTMLElement> {
        const body = $("<tbody/>");
        for (const row of this.data) {
            const tr = this.renderRow(row);
            body.append(tr);
        }

        return body;
    }

    protected renderRow(row: IHoaDonCT): JQuery<HTMLElement> {
        const tr = $("<tr/>");
        tr.html(`
        <td>${row.ma_thuoc}</td>
        <td>${row.ten_thuoc}</td>
        `);
        return tr;
    }
}

export {HoaDonNhap};
