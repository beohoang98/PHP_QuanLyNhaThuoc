import { ViewTable } from "./ViewTable";

class ThuocTable extends ViewTable {

    public constructor() {
        super();
    }

    public async render(search: string) {
        const data = await this.update(search);
        this.element.find("tbody").html("");
    }
}

export {ThuocTable};
