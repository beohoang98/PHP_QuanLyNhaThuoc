class KeyEvent {
    private eventAttach: any;
    private isBlocking: boolean;

    public constructor() {
        this.eventAttach = {};
        this.isBlocking = false;
        $(document).on("keydown", (e: JQuery.Event) => {
            if (this.isBlocking) {
                return;
            }

            let combKey = "";
            if (e.ctrlKey) {
                combKey = "ctrl+";
            }
            combKey += e.key;
            if (this.eventAttach.hasOwnProperty(combKey)) {
                const listFunc = this.eventAttach[combKey];
                for (const func of listFunc) {
                    if (typeof func === "function") {
                        func(e);
                    }
                }
            }
        });
    }

    public on(combKey: string, func: (e) => any) {
        if (!this.eventAttach[combKey]) {
            this.eventAttach[combKey] = [];
        }
        this.eventAttach[combKey].push(func);
    }

    public block() {
        this.isBlocking = true;
    }

    public unblock() {
        this.isBlocking = false;
    }
}

export {KeyEvent};
