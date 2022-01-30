let started = false;

class Application {
    #_backsoundPlay = false;
    #_key;
    static start() {
        if (started)
            return;

        const app = new Application();
        console.log(app);

        $(document).ready(function () {
            app.#_hideLoader();
            app.#_createKey();
            app.#_init(app);
            started = true;
        });
    }

    async #_init(app = this) {
        const params = app.#_getParams();

        $('#_test-load').click(function () {
            app.#_showLoader();
        });

        this.#_http.instance = axios.create({
            baseURL: 'http://localhost',
            timeout: 1000,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            validateStatus: (status) => status >= 200 && status < 500
        });

        this.#_db.instance = new Dexie("ecaziz-app");
        this.#_db.instance.version(1).stores({
            session: '++id, key, value',
        });
        this.#_session.db = this.#_db;

        await this.#_clientInit();

        if (params) {
            app.#_saveParams(params);
        }

        console.log("axios", this.#_http.instance);
        // window.history.pushState("", "", '/');
    }

    async #_clientInit() {
        let clientId = await this.#_session.get('client_id');
        if (clientId)
            this.#_http.client = clientId;

        let clientData = await this.#_http.get("/client");
        if (clientData.success) {
            clientData = clientData.content;
            this.#_session.set("client_id", clientData.id);
            this.#_session.set("client_salt", clientData.salt);
            this.#_http.client = clientData.id;
        }
    }

    #_showLoader() {
        $('body').append(`
        <div class="preloader" style="display: none; background: rgba(246,241,240, .8)">
            <div class="lds-heart">
                <div></div>
            </div>
        </div>`);

        $('body').css('overflow', 'hidden');

        $('.preloader').fadeIn('fast');
        setTimeout(function () {
            window.location.reload();
        }, 1500);
    }

    #_hideLoader() {
        const $this = this;
        $('.preloader').fadeOut("slow", function () {
            $(this).remove();
            const backsound = document.getElementById('backsound');
            if (backsound.paused && !$this.#_backsoundPlay) {
                try {
                    setTimeout(function() {
                        backsound.play();
                    }, 1500);
                } catch (error) { }

                $this.#_backsoundPlay = true;
            }
        });
    }

    #_getParams() {
        const param = window.location.search.substring(1);
        if (!param)
            return null;

        let params = param.split('&');
        const result = {};
        params.map((s) => result[s.slice(0, s.indexOf('='))] = s.slice(s.indexOf('=') + 1));

        return result;
    }

    #_cookie = {
        set: function (name, value, days = 1) {
            const d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            value = CryptoJS.AES.encrypt(value, this.key).toString();
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        },
        get: function (name) {
            var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            v = v ? v[2] : null;
            if (!v)
                return null;

            console.log("key", this.key);
            v = CryptoJS.AES.decrypt(v, this.key).toString(CryptoJS.enc.Utf8);

            return v ? v : null;
        },
        delete: function (name) {
            if (!this.get(name))
                return;

            this.setCookie(name, '', -1);
        }
    };

    #_createKey() {
        const n_i = window.navigator;
        const s_i = window.screen;
        let ids = n_i.mimeTypes.length;
        ids += n_i.userAgent.replace(/\D+/g, '');
        ids += n_i.plugins.length;
        ids += s_i.height || '';
        ids += s_i.width || '';
        ids += s_i.pixelDepth || '';
        console.log("device", ids);
        this.#_key = CryptoJS.SHA1(ids).toString().substring(24);
        this.#_cookie.key, this.#_session.key = this.#_key;
    }

    #_saveParams(params) {
        if (params.invite)
            this.#_cookie.set("invite", params.invite);

        this.#_http.get();
    }

    #_session = {
        set: async function (key, value) {
            const oldSession = await this.db.getOne({
                table: 'session',
                where: { key: key }
            });

            if (oldSession) {
                const updated = await this.db.update({
                    table: 'session',
                    data: {
                        key: key,
                        value: CryptoJS.AES.encrypt(value, this.key).toString()
                    },
                    id: oldSession.id
                });

                return updated == 1 ? Promise.resolve(true) : Promise.resolve(false);
            } else {
                return Promise.resolve(await this.db.insert({
                    table: 'session',
                    data: {
                        key: key,
                        value: CryptoJS.AES.encrypt(value, this.key).toString()
                    }
                }));
            }
        },
        get: async function (key) {
            const sessionData = await this.db.getOne({
                table: 'session',
                where: { key: key }
            });

            if (!sessionData)
                return null;

            try {
                const session = CryptoJS.AES.decrypt(sessionData.value, this.key).toString(CryptoJS.enc.Utf8);
                return session;
            } catch (error) {
                return null;
            }

        },
        unset: async function (key) {

        }
    };

    #_db = {
        insert: async function (prop = {}) {
            console.log("insert", prop.data);
            try {
                await this.instance[prop.table].add(prop.data);
                return Promise.resolve(true);
            } catch (error) {
                return Promise.resolve(false);
            }
        },
        getAll: async function (prop = {}) {
            const where = Object.keys(prop.where);
            return await this.instance[prop.table].where(where[0]).equals(prop.where[where[0]]).toArray();
        },
        getOne: async function (prop = {}) {
            const result = await this.getAll(prop);
            return result.length < 1 ? Promise.resolve(null) : Promise.resolve(result[0]);
        },
        update: async function (prop = {}) {
            return Promise.resolve(await this.instance[prop.table].update(prop.id, prop.data));
        },
        delete: async function (prop = {}) {
            return Promise.resolve(await this.instance[prop.table].delete(prop.id));
        }
    }

    #_http = {
        get: async function (path, prop = {}) {
            if (this.client)
                this.instance.defaults.headers.common['Client'] = this.client;

            const response = await this.instance.get(path);
            return Promise.resolve(response.data);
        },
        post: async function () {
            console.log("oke");
        },
        put: async function () {

        },
        patch: async function () {

        },
        delete: async function () {

        }
    }
}