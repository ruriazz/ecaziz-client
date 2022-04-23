const baseUrl = (path = '/') => {
    let url = window.location.origin;
    if (path.charAt(0) !== '/')
        url += '/';

    url += path;
    return url;
}

class App {
    static async getInstance() {
        const app = new App();
        app.currentPath = window.location.pathname;
        app.storage = await Storage.getInstance('default');
        app.session = await Session.getInstance();
        app.api = await APIClient.getInstance();

        app.browserUnsupport = setTimeout(function() {
            const message = `
                <div class="container text-center browser-unsupport" style="display: none;">
                    Halaman ini tidak support dengan browser yang kamu gunakan.
                    Mohon gunakan internet browser lain seperti <b>Google Chrome</b> <img src="${baseUrl('assets/logo/chrome.png')}" alt=""> atau <b>Safari</b> <img src="${baseUrl('assets/logo/safari.png')}"> untuk dapat membuka halaman ini dengan nyaman.
                    <br>
                    &#8212;<em>Terima kasih<em>&#8212;
                </div>
            `;

            const preloader = $('div.preloader');
            const ldsHeart = $('div.lds-heart');

            preloader.append(message);
            ldsHeart.fadeOut('slow', function() {
                $('div.browser-unsupport').fadeIn();
                $(this).remove();
            });
        }, 10000);

        const tokenSaved = await app.session.get('auth_data');
        if (tokenSaved) {
            const validToken = await app.api.fetch({
                path: '/users/auth-token',
                method: 'GET'
            });

            app.isAuth = validToken.success;
            app.#authComponent();
            app.#initModalUndangan();
        }

        return Promise.resolve(app);
    }

    async pageAuth() {
        if (typeof this.isAuth !== undefined && this.isAuth == true) {
            const userData = await this.session.get('user_data');
            
            $('#user-name').html(userData.name);
            $('#username').html(userData.username);

            return Promise.resolve(true);
        }

        $('body').remove();
        window.location.href = baseUrl('/auth');
    }

    #authComponent() {
        const $this = this;
        const signoutBtn = $('#signout-btn');
        if (signoutBtn.length > 0)
            signoutBtn.click((evt) => $this.#signOut(evt, $this));

    }

    async #signOut(evt, $this) {
        evt.preventDefault();

        $this.showLoader();
        await $this.session.unset('auth_data');
        await $this.session.unset('user_data');
        window.location.reload();
    }

    async isInvited() {
        const query = new URLSearchParams(window.location.search);

        if(!query.get('inv'))
            return null;

        const apiResponse = await this.api.fetch({
            method: 'GET',
            path: `/undangan/${query.get('inv')}`
        });

        if(!apiResponse.success)
            return null;

        let data = apiResponse.content;
        data.link = data.link.replaceAll('BASE_URL', app_config.BASE_URL);
        data.relation_header = data.person_type.split('&lt;|&gt;')[0].trim();
        data.relation_body = data.person_type.split('&lt;|&gt;')[1].trim();

        if(data.undangan_type == 'G') {
            if(data.response)
                delete data.response;

            const rsvp = await this.session.get(`rsvp-${data.id}`);
            if(rsvp)
                data.response = [rsvp];
        }

        delete data.person_type;
        return Promise.resolve(data);
    }

    async isOpened() {
        const session = await this.session.get('app-opened');

        return Promise.resolve(session);
    }

    buildWhatsappMessage(undangan, encode = true) {
        let relationHeader = undangan.person_type.split('&lt;|&gt;')[0].trim();
        let relationBody = undangan.person_type.split('&lt;|&gt;')[1].trim();
        let messageBody = `_Assalamualaikum warahmatullahi wabarakatuh._\n\nYth.\n:HEAD_RELATION: *:NAME:*\ndi :LOCATION:\n\n_Bismillahirahmanirrahim._\nDengan memohon Ridho dan Rahmat Allah SWT, tanpa mengurangi rasa hormat, perkenankan kami menginformasikan kabar baik kepada :RELATION: perihal acara pernikahan kami.\n\n*${app_config.BRIDE.capitalize()}*\n                 _dan_ \n  *${app_config.GROOM.capitalize()}*\n\nBerikut link untuk info lengkap dari acara kami :\n:URL:\n\nMerupakan suatu kebahagiaan bagi kami apabila :RELATION: dapat memberikan doa dan restu untuk mengiringi niat tulus kami, sehingga pernikahan kami senantiasa dalam ridho dan rahmat Allah Subhanahu Wa Ta'ala. _Aamiin Yaa Rabbal Aalamin._\n\nTerima Kasih,\n_Wassalamualaikum warahmatullahi wabarakatuh._`;
        let name = undangan.person_name.capitalize();
        let location = undangan.person_location.capitalize();
        let url = undangan.link.replaceAll('BASE_URL', app_config.BASE_URL);

        messageBody = messageBody.replaceAll(':HEAD_RELATION:', relationHeader.capitalize());
        messageBody = messageBody.replaceAll(':RELATION:', relationBody);
        messageBody = messageBody.replaceAll(':NAME:', name);
        messageBody = messageBody.replaceAll(':LOCATION:', location);
        messageBody = messageBody.replaceAll(':URL:', url);

        if (encode)
            messageBody = encodeURIComponent(messageBody);

        return messageBody;
    }

    showSnackbar({text = 'default snackbar text', timeout = 1000, onShow = function(){}, onHide = function(){}} = {}) {
        $('#snackbar').remove();
        $('body').append(`<div id="snackbar">${text}</div>`);
        const snackbar = $('#snackbar');
        snackbar.addClass('show');
        if(typeof onShow == 'function')
            onShow();

        setTimeout(function(){
            snackbar.fadeOut(function() {
                $(this).remove();
                if(typeof onHide == 'function')
                    onHide();
            });
        }, timeout);
    }

    openWhatsapp(message, phone = null) {
        let params = `text=${message}`;
        if (phone != null)
            params += `&phone=${phone}`;

        // window.location.href = `whatsapp://send?${params}`;
        window.open(`whatsapp://send?${params}`, "_blank") || window.location.replace(`whatsapp://send?${params}`);
    }

    copyTextToClipboard(e, { target: t = document.body } = {}) {
        const n = document.createElement("textarea"),
            o = document.activeElement;
        n.value = e, n.setAttribute("readonly", ""), n.style.contain = "strict", n.style.position = "absolute", n.style.left = "-9999px", n.style.fontSize = "12pt";
        const c = document.getSelection(),
            a = c.rangeCount > 0 && c.getRangeAt(0);
        t.append(n), n.select(), n.selectionStart = 0, n.selectionEnd = e.length;
        let l = !1;
        try {
            l = document.execCommand("copy")
        } catch { }
        return n.remove(), a && (c.removeAllRanges(), c.addRange(a)), o && o.focus(), l
    }

    showSnackbar({text = 'default snackbar text', timeout = 1000, onShow = function(){}, onHide = function(){}} = {}) {
        $('#snackbar').remove();
        $('body').append(`<div id="snackbar">${text}</div>`);
        const snackbar = $('#snackbar');
        snackbar.addClass('show');
        if(typeof onShow == 'function')
            onShow();

        setTimeout(function(){
            snackbar.fadeOut(function() {
                $(this).remove();
                if(typeof onHide == 'function')
                    onHide();
            });
        }, timeout);
    }

    showLoader(func = undefined) {
        const loader = `
        <div class="preloader" style="background: rgba(255, 255, 255, .5)">
            <div class="lds-heart">
                <div></div>
            </div>
        </div>
        `;

        $('body').append(loader);
        $('body').css('overflow', 'hidden');
        $('.preloader').fadeIn('fast', function () {
            if (typeof func == 'function')
                func();
        });
    }

    hideLoader(func = undefined) {
        const $this = this;
        const loader = $('.preloader');

        loader.fadeOut('slow', function () {
            $('body').css('overflow', '');
            loader.remove();

            if($this.browserUnsupport !== false) {
                clearInterval($this.browserUnsupport);
                $this.browserUnsupport = false;
            }

            if (typeof func == 'function')
                func();
        })
    }

    #initModalUndangan() {
        const $this = this;
        const formUndangan = $('#form-data-undangan');
        const selectType = $('input[name="undangan-type"]');
        const inputName = $('#input-person-name');
        const statusUndangan = $('#is-active-undangan');
        const inputRelationHeader = $('#input-relation-header');
        const inputRelationBody = $('#input-relation-body');

        formUndangan.submit((evt) => $this.#submitNewUndangan(evt, $this));

        selectType.change(function () {
            const value = $(this).val();
            switch (value) {
                case 'G':
                    inputName.attr('placeholder', 'Nama Grup');
                    inputName.attr('undangan-type', 'G');
                    break;

                case 'O':
                    inputName.attr('placeholder', 'Nama Seseorang');
                    inputName.attr('undangan-type', 'O');
                    break;

                default:
                    break;
            }
        });

        inputRelationHeader.keyup(function () {
            const currentVal = inputRelationHeader.val();
            inputRelationBody.val(currentVal);
        });

        statusUndangan.change(function () {
            const checked = $(this).val();
            if (checked == 1) {
                $(this).val(0);
            } else {
                $(this).val(1);
            }
        });

        $('#kt_modal_create_undangan').on('shown.bs.modal', (e) => {
            $('.drawer-overlay').click();
        });

        $('#kt_modal_create_undangan').on('hidden.bs.modal', (e) => {
            formUndangan.data('submit', 'new');
            inputName.val('');
            inputRelationHeader.val('');
            inputRelationBody.val('');
            $('#input-person-partner').val('');
            $('#input-person-location').val('');
            $('#input-phone-number').val('');
        });
    }

    covertDatetime(datetime) {
        const pyToJSDateFormats = Object.freeze({
            '%A': 'dddd',                           //Weekday as locale’s full name: (In English: Sunday, .., Saturday)(Auf Deutsch: Sonntag, .., Samstag)   
            '%a': 'ddd',                            //Weekday abbreivated: (In English: Sun, .., Sat)(Auf Deutsch: So, .., Sa)
            '%B': 'MMMM',                           //Month name: (In English: January, .., December)(Auf Deutsch: Januar, .., Dezember)
            '%b': 'MMM',                            //Month name abbreviated: (In English: Jan, .., Dec)(Auf Deutsch: Jan, .., Dez)
            '%c': 'ddd MMM DD HH:mm:ss YYYY',       //Locale’s appropriate date and time representation: (English: Sun Oct 13 23:30:00 1996)(Deutsch: So 13 Oct 22:30:00 1996) 
            '%d': 'DD',                             //Day 0 padded: (01, .., 31)
            '%f': 'SSS',                            //Microseconds 0 padded: (000000, .., 999999)
            '%H': 'HH',                             //Hour (24-Hour) 0 padded: (00, .., 23) 
            '%I': 'hh',                             //Hour (12-Hour) 0 padded: (01, .., 12)
            '%j': 'DDDD',                           //Day of Year 0 padded: (001, .., 366) 
            '%M': 'mm',                             //Minute 0 padded: (01, .. 59) 
            '%m': 'MM',                             //Month 0 padded: (01, .., 12)
            '%p': 'A',                              //Locale equivalent of AM/PM: (EN: AM, PM)(DE: am, pm)
            '%S': 'ss',                             //Second 0 padded: (00, .., 59)
            '%U': 'ww',                             //Week # of Year (Sunday): (00, .., 53)  All days in a new year preceding the first Sunday are considered to be in week 0.
            '%W': 'ww',                             //Week # of Year (Monday): (00, .., 53)  All days in a new year preceding the first Monday are considered to be in week 0.
            '%w': 'd',                              //Weekday as #: (0, 6)
            '%X': 'HH:mm:ss',                       //Locale's appropriate time representation: (EN: 23:30:00)(DE: 23:30:00)
            '%x': 'MM/DD/YYYY',                     //Locale's appropriate date representation: (None: 02/14/16)(EN: 02/14/16)(DE: 14.02.16)
            '%Y': 'YYYY',                           //Year as #: (1970, 2000, 2038, 292,277,026,596)
            '%y': 'YY',                             //Year without century 0 padded: (00, .., 99)
            '%Z': 'z',                              //Time zone name: ((empty), UTC, EST, CST) (empty string if the object is naive).
            '%z': 'ZZ',                             //UTC offset in the form +HHMM or -HHMM: ((empty), +0000, -0400, +1030) Empty string if the the object is naive.
            '%%': '%'                               //A literal '%' character: (%)
        });

        for (let key in pyToJSDateFormats) {
            datetime = datetime.split(key).join(pyToJSDateFormats[key]);
        }
        return datetime;
    }

    async #submitNewUndangan(evt, $this) {
        evt.preventDefault();
        const submitType = $('#form-data-undangan').data('submit');
        const inputName = $('#input-person-name');
        const inputRelationHeader = $('#input-relation-header');
        const inputRelationBody = $('#input-relation-body');
        const inputPartner = $('#input-person-partner');
        const inputLocation = $('#input-person-location');
        const undanganType = inputName.attr('undangan-type');
        const phoneNumber = $('#input-phone-number');
        const statusUndangan = $('#is-active-undangan');

        const relation = `${inputRelationHeader.val().length > 0 ? inputRelationHeader.val().trim() : undanganType == 'O' ? 'Bapak/Ibu' : 'Bapak/Ibu Saudara/i'}<|>${inputRelationBody.val().length > 0 ? inputRelationBody.val().trim() : undanganType == 'O' ? 'Bapak/Ibu' : 'Bapak/Ibu Saudara/i'}`;

        const validateData = () => {
            const result = {
                undangan_type: undanganType,
                person_type: relation,
                person_name: inputName.val(),
                person_partner: inputPartner.val().length > 0 ? inputPartner.val() : 'keluarga',
                person_location: inputLocation.val().length > 0 ? inputLocation.val() : 'tempat',
                phone_number: phoneNumber.val().length > 0 ? phoneNumber.val() : null,
                is_active: statusUndangan.val() == 0 || statusUndangan.val() == 1 ? statusUndangan.val() : 0
            };

            return result;
        };

        $this.showLoader(async () => {
            let apiResponse;
            let isNew = true;

            if (submitType == 'new') {
                apiResponse = await $this.api.fetch({
                    method: 'POST',
                    path: '/undangan/',
                    data: validateData()
                });
            } else {
                isNew = false;
                apiResponse = await $this.api.fetch({
                    method: 'PUT',
                    path: `/undangan/${submitType}`,
                    data: validateData()
                });
            }

            if (apiResponse.success) {
                const alert = $this.buildAlertUndanganCreated(apiResponse.content, isNew);
                const modalForm = '#kt_modal_create_undangan';

                $this.hideLoader(() => {
                    $(modalForm).modal('hide');
                    $(alert).modal('show');
                });
            }
        });
    }

    buildAlertUndanganCreated(undangan, isNew) {
        let urlUndangan = undangan.link;
        urlUndangan = urlUndangan.replaceAll('BASE_URL', app_config.BASE_URL);

        const alert = `
            <div class="modal fade" tabindex="-1" id="modal-alert-created_${undangan.id}">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="alert alert-dialog bg-light-success d-flex flex-center flex-column py-10 px-10 px-lg-20">
                            <button type="button" class="position-absolute top-0 end-0 m-2 btn btn-icon btn-icon-success" data-bs-dismiss="alert">
                                <span class="svg-icon svg-icon-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="black"></rect>
                                        <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black"></rect>
                                    </svg>
                                </span>
                            </button>
                            <span class="svg-icon svg-icon-5tx svg-icon-success mb-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect opacity="0.3" x="2" y="2" width="20" height="20" rx="10" fill="black" />
                                    <path d="M10.4343 12.4343L8.75 10.75C8.33579 10.3358 7.66421 10.3358 7.25 10.75C6.83579 11.1642 6.83579 11.8358 7.25 12.25L10.2929 15.2929C10.6834 15.6834 11.3166 15.6834 11.7071 15.2929L17.25 9.75C17.6642 9.33579 17.6642 8.66421 17.25 8.25C16.8358 7.83579 16.1642 7.83579 15.75 8.25L11.5657 12.4343C11.2533 12.7467 10.7467 12.7467 10.4343 12.4343Z" fill="black" />
                                </svg>
                            </span>
                            <div class="text-center text-dark">
                                <h1 class="fw-bolder mb-5">Undangan berhasil dibuat</h1>
                                <div class="separator separator-dashed border-success opacity-25 mb-5"></div>
                                <div class="mb-9">
                                    <input type="text" class="form-control text-center" id="url-field" value="${urlUndangan}" readonly/>
                                    <div class="text-center my-1">
                                        <button class="btn btn-sm btn-success" id="btn-copy-url">Salin Url</button>
                                    </div>
                                </div>
                                <div class="d-flex flex-center flex-wrap">
                                    <a href="javascript:void(0)" class="btn btn-outline btn-outline-success btn-active-success m-2 dialog-close">Selesai</a>
                                    <a href="javascript:void(0)" class="btn btn-success m-2 btn-open-whatsapp">Bagikan Wahtsapp</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(alert);
        const $this = this;
        const urlField = $('#url-field');
        const btnCopyUrl = $('#btn-copy-url');
        const btnOpenWa = $('.btn-open-whatsapp');

        btnCopyUrl.click(() => {
            urlField.select();
            document.execCommand('copy');
        });

        urlField.click(() => {
            urlField.select();
            document.execCommand('copy');
        });

        btnOpenWa.click(() => {
            const messageBody = this.buildWhatsappMessage(undangan);
            $(`#modal-alert-created_${undangan.id}`).modal('hide');

            $this.openWhatsapp(messageBody, undangan.phone_number != null ? undangan.phone_number : null);
        });

        $(`#modal-alert-created_${undangan.id}`).modal({ backdrop: 'static', keyboard: false });
        $('.alert-dialog').on('closed.bs.alert', () => {
            $(`#modal-alert-created_${undangan.id}`).modal('hide');
        });
        $('.dialog-close').click(() => {
            $('.alert-dialog').alert('close');
        });

        $(`#modal-alert-created_${undangan.id}`).on('hidden.bs.modal', (e) => {
            $(this).remove();
            if ($this.currentPath == '/undangan') {
                window.location.reload();
            }
        });

        return `#modal-alert-created_${undangan.id}`;
    }

    copyTextToClipboard(text, onCopied = function(success){}) {
        const fallbackCopyTextToClipboard = (text) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;

            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if(successful && typeof onCopied == 'function')
                    onCopied(successful);
            } catch (err) {
                if(typeof onCopied == 'function')
                    onCopied(false);
            }

            document.body.removeChild(textArea);
        }

        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }

        navigator.clipboard.writeText(text).then(function () {
            if(typeof onCopied == 'function')
                onCopied(true);
        }, function (err) {
            if(typeof onCopied == 'function')
                onCopied(false);
        });
    }

    activateMenuItem(index) {
        const items = $('a[class=menu-link]');
        if (index > items.length)
            return;

        $(items[index]).addClass('active');
    }

    setPageTitle(value) {
        let pageTitle = $('.page-title');
        if (pageTitle.length < 1)
            return;

        pageTitle = $(pageTitle[0]).children()[0];
        $(pageTitle).html(value);
    }

    serverError(func = undefined) {
        const alert = `
            <div class="alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row w-100 p-5 mb-10 alert-server-error">
                <span class="svg-icon svg-icon-2hx svg-icon-danger me-4 mb-5 mb-sm-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path opacity="0.3" d="M2 4V16C2 16.6 2.4 17 3 17H13L16.6 20.6C17.1 21.1 18 20.8 18 20V17H21C21.6 17 22 16.6 22 16V4C22 3.4 21.6 3 21 3H3C2.4 3 2 3.4 2 4Z" fill="black"></path>
                        <path d="M18 9H6C5.4 9 5 8.6 5 8C5 7.4 5.4 7 6 7H18C18.6 7 19 7.4 19 8C19 8.6 18.6 9 18 9ZM16 12C16 11.4 15.6 11 15 11H6C5.4 11 5 11.4 5 12C5 12.6 5.4 13 6 13H15C15.6 13 16 12.6 16 12Z" fill="black"></path>
                    </svg>
                </span>
                <div class="d-flex flex-column pe-0 pe-sm-10">
                    <h4 class="fw-bold">Internal server error</h4>
                    <span>Please contact your server admin.</span>
                </div>
                <button type="button" class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto" data-bs-dismiss="alert">
                    <span class="svg-icon svg-icon-1 svg-icon-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect opacity="0.5" x="6" y="17.3137" width="16" height="2" rx="1" transform="rotate(-45 6 17.3137)" fill="black"></rect>
                            <rect x="7.41422" y="6" width="16" height="2" rx="1" transform="rotate(45 7.41422 6)" fill="black"></rect>
                        </svg>
                    </span>
                </button>
            </div>
        `;

        $('body').append(alert);
        this.hideLoader(function () {
            $('.alert-server-error').addClass('show');
            if (typeof func == 'function')
                func();
        });
    }
}

const app = await App.getInstance();