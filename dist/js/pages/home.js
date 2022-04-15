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
        const invitation = await app.isInvited();
        const btnOpenUndangan = $('.btn-open-undangan');
        const btnSoundControll = $('button.sound-controll');
        const btnToTop = $('.btn-to-top');
        const api = app.api;
        const session = app.session;
        const galeryImages = $('div.gallery-img');

        galeryImages.click(function() {
            $('div.mfp-bg').css('background', 'red');
        });

        let invitationResponse = [];
        let responsePagination = {
            current_page: 1,
            limit: 10,
            total_page: 1,
            total_results: 0,
            total_rows: 0
        };

        if(invitationResponse.success) {
            invitationResponse = invitationResponse.content.ucapans;
            responsePagination = invitationResponse.content.responsePagination;
        } else {
            invitationResponse = [];
        }

        $('body').addClass('init');
        $('.oliven-nav-toggle').addClass('init');

        $(document).ready(function() {
            $('#gallery').append(`
                <div class="container">
                    <div class="row gallery-filter mt-3">
                        <div class="col-md-4 gallery-item ceremony">
                            <a href="${baseUrl('assets/images/gallery/1.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/1.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-4 gallery-item party">
                            <a href="${baseUrl('assets/images/gallery/2.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/2.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-4 gallery-item ceremony">
                            <a href="${baseUrl('assets/images/gallery/3.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/3.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-4 gallery-item party">
                            <a href="${baseUrl('assets/images/gallery/4.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/4.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-4 gallery-item ceremony">
                            <a href="${baseUrl('assets/images/gallery/5.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/5.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-4 gallery-item party">
                            <a href="${baseUrl('assets/images/gallery/6.jpg')}" class="img-zoom">
                                <div class="gallery-box">
                                    <div class="gallery-img"> <img src="${baseUrl('assets/images/gallery/6.jpg')}" class="img-fluid mx-auto d-block" alt=""> </div>
                                    <div class="gallery-detail">
                                        <h4 class="mb-0"></h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            `);

            $(".img-zoom").magnificPopup({
                type: "image", 
                closeOnContentClick: !0,
                mainClass: "mfp-fade",
                gallery: {
                    enabled: !0,
                    navigateByImgClick: !0,
                    preload: [0, 1]
                }
            });

            // const mainSplide = new Splide('#main-splide', {
            //     type      : 'fade',
            //     rewind    : true,
            //     pagination: true,
            //     arrows    : true,
            // });

            // const thumbnailSplide = new Splide('#thumbnail-splide', {
            //     fixedWidth  : 100,
            //     fixedHeight : 100,
            //     gap         : 10,
            //     rewind      : true,
            //     pagination  : false,
            //     isNavigation: true,
            //     breakpoints : {
            //       600: {
            //         fixedWidth : 60,
            //         fixedHeight: 44,
            //       },
            //     }
            // });

            // mainSplide.sync( thumbnailSplide );
            // mainSplide.mount();
            // thumbnailSplide.mount();

            setTimeout(function() {
                if($(document).scrollTop() > 0) {
                    $([document.documentElement, document.body]).animate({
                        scrollTop: $("#home").offset().top
                    }, 1000);
                }
            }, 50);
        });

        const addResponseItem = function(response, append = true) {
            if(!invitationResponse.containsObject(response)) {
                const responseList = $('ul.response-list');
                const item = `
                    <li class="response-item">
                        <div class="item-header">
                            <small>${response.updated_at.formatDate()}</small>
                        </div>
                        <p class="item-message">
                            ${response.message.trim()}${response.message.charAt(response.message.length - 1) == '.' ? '' : '.'}
                            <span class="sender">&#8212;${response.sender}</span>
                        </p>
                    </li>
                `;

                if(append) {
                    invitationResponse.push(response);

                    if(!response.message)
                        return;

                    responseList.append(item);
                } else {
                    invitationResponse.unshift(response);
                    responseList.prepend(item);
                }
            }
        };

        const loadResponse = async function(page = 1) {
            try {
                const response = await api.fetch({
                    method: 'GET',
                    path: `/ucapan/?limit=10&page=${page}`
                });
    
                if(response.success) {
                    responsePagination = response.content.pagination;
                    response.content.ucapans.forEach(i => addResponseItem(i));
                }
            } catch (error) {}
        };
        

        if(invitation) {
            console.log(invitation);

            $('.welcome-card span.inner-name').html(`${invitation.relation_header} ${invitation.person_name}`.capitalize());
            $('.welcome-card').addClass('show');

            var initRSVPForm = function(updated = false) {
                const rsvpForm = $('#rsvp-form');
                const rsvpName = $('#rsvp-name');
                const rsvpMessage = $('#rsvp-message');
                const rsvpAttendChoice = $('input[type=radio][name=rsvp-attend-choice]');
                const submitButton = $('div#submit-button');
                const postedTime = $('small#posted-time');
                const rsvpFormTitle = $('span#rsvp-form-title');
                let rsvpAttend = rsvpForm.data('attend');

                if(updated || typeof invitation.response != 'undefined') {
                    const response = invitation.response[0];
                    rsvpAttendChoice.prop('disabled', true);
                    $(rsvpAttendChoice.parent()).addClass('disabled');

                    rsvpName.val(response.sender);
                    rsvpName.prop('readonly', true);

                    rsvpMessage.val(response.message);
                    rsvpMessage.prop('readonly', true);

                    postedTime.html(`Posted on ${response.created_at.formatDate()}`);
                    postedTime.addClass('font-weight-bold');
                    submitButton.remove();
                    rsvpFormTitle.remove();

                    if(updated)
                        return;
                } else {
                    if(invitation.undangan_type == 'O')
                    rsvpName.val(invitation.person_name.capitalize());

                rsvpAttendChoice.change(function() {
                    const $val = $(this).val();
                    rsvpAttend = $val;
                    rsvpForm.data('attend', $val);
                });

                const validateRSVPData = function() {
                    let valid = true;
                    let data = {
                        undangan: invitation.id
                    };

                    if(rsvpName.val().trim().length >= 3 && rsvpName.val().trim().length <= 20) {
                        data.sender = rsvpName.val().trim();
                        rsvpName.removeClass('is-invalid');
                    } else {
                        valid = false;
                        rsvpName.addClass('is-invalid');
                    }

                    if(rsvpAttend == 'attend' || rsvpAttend == 'uncertain') {
                        data.text = `${rsvpAttend} +_~_+ `;
                        rsvpAttendChoice.removeClass('is-invalid');
                    } else {
                        valid = false;
                        rsvpAttendChoice.addClass('is-invalid');
                    }

                    if(rsvpMessage.val().trim().length >= 3 && rsvpMessage.val().trim().length <= 250) {
                        data.text += rsvpMessage.val().trim();
                        rsvpMessage.removeClass('is-invalid');
                    } else {
                        valid = false;
                        rsvpMessage.addClass('is-invalid');
                    }

                    if(!valid)
                        return false;

                    return data;
                }

                let onSubmit = false;
                rsvpForm.submit(function(evt) {
                    evt.preventDefault();

                    const data = validateRSVPData();
                    if(!data || onSubmit)
                        return false;

                        onSubmit = true;
                    app.showLoader(async function() {
                        let message = 'Your R.S.V.P saved';
                        const submitResponse = await api.fetch({
                            path: '/ucapan/',
                            method: 'POST',
                            data: data
                        });

                        console.log("submitResponse", submitResponse);

                        if(submitResponse.success) {
                            let newResponse = submitResponse.content;
                            let attend = newResponse.text.split(' +_~_+ ')[0];
                            newResponse.message = newResponse.text.split(' +_~_+ ')[1] ? newResponse.text.split(' +_~_+ ')[1] : null;
                            newResponse.attend = attend == 'attend' ? true : false;
                            delete newResponse.text;
                            addResponseItem(newResponse, false);

                            await session.set('rsvp', newResponse);

                            rsvpAttendChoice.prop('disabled', true);
                            $(rsvpAttendChoice.parent()).addClass('disabled');
                            rsvpName.prop('readonly', true);
                            rsvpMessage.prop('readonly', true);

                            submitButton.fadeOut(function() {
                                submitButton.remove();
                                postedTime.html(`Posted on ${newResponse.created_at.formatDate()}`);
                                postedTime.addClass('font-weight-bold');
                            });

                            rsvpFormTitle.fadeOut(function() {
                                rsvpFormTitle.remove();
                            });
                        } else {
                            message = 'failed to save your R.S.V.P';
                        }

                        setTimeout(() => {
                            onSubmit = false;
                            app.hideLoader(function() {
                                app.showSnackbar({
                                    text: message,
                                    timeout: 1500
                                })
                            });
                        }, 1000);
                    });
                });
                }

            };
        } else {
            $('.arrow').css('top', '20vh');
            $('div.rsvp-form-container').remove();
            // $($('.oliven-main-menu ul').children()[5]).remove();

        }

        btnOpenUndangan.click(function() {
            const backsound = document.getElementById("backsound");
            const soundControllIcon = $(btnSoundControll.children()[0]);

            btnSoundControll.data('pause', false);
            btnSoundControll.removeClass('init');
            backsound.play();
            soundControllIcon.fadeOut(function() {
                btnSoundControll.html('<i class="ti-volume"></i>');
            })
            

            $('body').removeClass('init');
            $('.oliven-nav-toggle').removeClass('init');
            $('.arrow').remove();
            $('aside#oliven-aside').css('display', '');
            $('div#oliven-main').css('width', '');
        });

        btnSoundControll.click(function() {
            if($(this).hasClass('init'))
                return false;
            
            const $this = $(this);
            const child = $($this.children()[0]);
            const backsound = document.getElementById("backsound");
            const isPlayed = function() {
                return !backsound.paused;
            };
            let dataPause = !$this.data('pause') ? true : false;
            let icon = '<i class="ti-control-pause"></i>';
            $(this).data('pause', dataPause);

            if(isPlayed()) {
                backsound.pause();
            } else {
                icon = '<i class="ti-volume"></i>';
                backsound.play();
            }

            child.fadeOut('fast', function() {
                $this.html(icon);
            })
        });

        btnToTop.click(function() {
            $('html,body').animate({ scrollTop: 0 }, 'slow');
        });

        $(document).scroll(function() {
            const pos = $(this).scrollTop();
            if(pos >= 2000) {
                btnToTop.fadeIn();
            } else {
                btnToTop.fadeOut();
            }
        });

        if(typeof initRSVPForm == 'function')
            initRSVPForm();

        app.hideLoader(async function() {
            await loadResponse();
            
            while (responsePagination.current_page < responsePagination.total_page && responsePagination.total_results == responsePagination.limit) {
                await loadResponse(responsePagination.current_page + 1);
            }
        });
    }
}

const home = await Home.getInstance();
home.run();