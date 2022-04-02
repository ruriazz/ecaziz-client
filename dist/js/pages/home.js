class Home {
    static async getInstance() {
        const home = new Home();


        return Promise.resolve(home);
    }

    async run() {
        const $this = this;

        $('body').fadeIn(() => $this.#init($this));
    }

    async #init($this) {

        app.hideLoader();
    }
}

const home = await Home.getInstance();
home.run();