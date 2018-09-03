interface IContextProperty {
    title: string;
    className?: string | null;
    click: (e: JQuery.Event) => any; // on click
    icon?: string | null;
}

class MenuContext {
    protected target: JQuery<HTMLElement>;
    protected element: JQuery<HTMLElement>;
    protected menu: IContextProperty[];

    public constructor(target: string | JQuery<HTMLElement>) {
        if (typeof target === "string") {
            this.target = $("#" + target);
        } else {
            this.target = target;
        }

        this.target.on("contextmenu", (e: JQuery.Event) => {
            e.preventDefault();
            e.stopPropagation();
            this.remove().render({x: e.clientX, y: e.clientY}).show();
        });

        this.menu = [];
    }

    public addContext(prop: IContextProperty) {
        this.menu.push(prop);
        return this;
    }

    public render(pos) {
        this.element = $("<ul/>").addClass("shadow-lg rounded my-contextmenu");
        this.element.css("top", pos.y + "px");
        this.element.css("left", pos.x + "px");
        for (const ctx of this.menu) {
            this.element.append(this.renderContext(ctx));
        }
        this.element.hide();
        return this;
    }

    public show() {
        $("body").append(this.element);
        this.element.slideDown(0.5);
        $(document).off("click", this.remove).on("click", this.remove);
        return this;
    }

    public remove() {
        $(".my-contextmenu").remove();
        return this;
    }

    protected renderContext(prop: IContextProperty): JQuery<HTMLElement> {
        const context = $("<li/>");
        context.html(`<i class='${prop.icon} ${prop.className}'></i> ${prop.title}`);
        context.on("click", (e: JQuery.Event) => {
            this.remove();
            prop.click(e);
        });
        return context;
    }
}

export {MenuContext};
