interface IHoaDonCT {
    ma_thuoc: string;
    ten_thuoc: string;
    so_luong: number;
    don_gia: number;
    thanh_tien: number;
}

class HoaDonNhap  {
    private element: JQuery<HTMLElement>;
    private data: IHoaDonCT[];
    private current: IHoaDonCT;
    private kieu: string;

    private funcUpdateGia;

    public constructor(target: string | JQuery<HTMLElement>) {
        this.element = null;
        this.data = [];
        this.current = null;
        this.funcUpdateGia = (gia) => {return; };

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
        this.updateGia();
    }

    public addHoaDon(cthd: IHoaDonCT) {
        this.data.push(cthd);
        this.element.append(this.renderRow(cthd));
        this.updateGia();
    }

    public getTongGia() {
        let gia = 0;
        for (const cthd of this.data) {
            gia += cthd.thanh_tien;
        }
        return gia;
    }

    public setKieu(kieu: string) {
        this.kieu = kieu;
        this.updateGia();
    }

    public updateGia() {
        const gia = +this.getTongGia();
        this.funcUpdateGia(gia);
    }

    public onUpdateTongGia(func) {
        this.funcUpdateGia = func;
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
        <td>${row.so_luong}</td>
        <td>${row.thanh_tien}</td>
        `);
        return tr;
    }
}

export {HoaDonNhap};
