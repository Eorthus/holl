

const screenWidth = window.screen.width

//lazyload
let images = document.querySelectorAll(".lazyload");
if (images) {
    lazyload(images);
}

//gsap scroll
gsap.registerPlugin(ScrollTrigger);


//smooth scroll
function smoothScroll(content, viewport, smoothness) {
    content = gsap.utils.toArray(content)[0];
    smoothness = smoothness || 1;

    gsap.set(viewport || content.parentNode, { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 });
    gsap.set(content, { overflow: "visible", width: "100%" });

    let getProp = gsap.getProperty(content),
        setProp = gsap.quickSetter(content, "y", "px"),
        setScroll = ScrollTrigger.getScrollFunc(window),
        removeScroll = () => content.style.overflow = "visible",
        killScrub = trigger => {
            let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
            scrub && scrub.kill();
            trigger.animation.progress(trigger.progress);
        },
        height, isProxyScrolling;

    function refreshHeight() {
        height = content.clientHeight;
        content.style.overflow = "visible"
        document.body.style.height = height + "px";
        return height - document.documentElement.clientHeight;
    }

    ScrollTrigger.addEventListener("refresh", () => {
        removeScroll();
        requestAnimationFrame(removeScroll);
    })
    ScrollTrigger.defaults({ scroller: content });
    ScrollTrigger.prototype.update = p => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)

    ScrollTrigger.scrollerProxy(content, {
        scrollTop(value) {
            if (arguments.length) {
                isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
                setProp(-value);
                setScroll(value);
                return;
            }
            return -getProp("y");
        },
        scrollHeight: () => document.body.scrollHeight,
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        }
    });

    return ScrollTrigger.create({
        animation: gsap.fromTo(content, { y: 0 }, {
            y: () => document.documentElement.clientHeight - height,
            ease: "none",
            onUpdate: ScrollTrigger.update
        }),
        scroller: window,
        invalidateOnRefresh: true,
        start: 0,
        end: refreshHeight,
        refreshPriority: -999,
        scrub: smoothness,
        onUpdate: self => {
            if (isProxyScrolling) {
                killScrub(self);
                isProxyScrolling = false;
            }
        },
        onRefresh: killScrub // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
    });
}

//mousemove logo
function onMouseMove(bg, fg) {
    return (event) => {
        const posX = event.clientX - window.innerWidth / 2;
        const posY = event.clientY - window.innerHeight / 2;
        const vRatio = posY / fg.offsetHeight / 2;
        const hRatio = posX / fg.offsetWidth / 2;

        bg.style.transform = `translate(${hRatio * -10}%, ${vRatio * -10}%)`;
        fg.style.transform = `translate(${hRatio * 10}%, ${vRatio * 10}%)`;
    };
}

function onReady() {
    if (document.querySelector('.parallax')) {
        const parallax = document.querySelector('.parallax');
        const [bg, fg] = [...parallax.querySelectorAll('.parallax-layer')];

        window.addEventListener('mousemove', onMouseMove(bg, fg), { passive: true });
    }

}


//mousemove booking
function onMouseMovebook(bg) {
    return (event) => {
        const posX = event.clientX - window.innerWidth / 2;
        const posY = event.clientY - window.innerHeight / 2;
        const vRatio = posY / bg.offsetHeight / 2;
        const hRatio = posX / bg.offsetWidth / 2;

        bg.style.transform = `translate(${hRatio * -10}%, ${vRatio * -10}%)`;
    };
}
function onReadybook() {
    if (document.querySelector('.parallax_book')) {
        const parallax = document.querySelector('.parallax_book');
        const [bg] = [...parallax.querySelectorAll('.parallax-layer_book')];

        window.addEventListener('mousemove', onMouseMovebook(bg), { passive: true });
    }

}

//kitchen slider
function onScroll(event) {
    var scrollPos = $(document).scrollTop();
    $('#menu a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#menu ul li a').removeClass("active");
            currLink.addClass("active");
        } else {
            currLink.removeClass("active");
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {

    //lang change icon
    document.querySelectorAll('.lang').forEach((el) => {
        el.addEventListener('click', () => {
            let new_img = el.querySelector('img').getAttribute('src')
            let old_img = document.querySelector('.header__currlang').querySelector('img').getAttribute('src')
            document.querySelector('.header__currlang').querySelector('img').setAttribute('src', new_img)
            el.querySelector('img').setAttribute('src', old_img)
        })

    })

    //before mount
    content.style.display = 'block';
    gsap.from('.page-changer', {
        xPercent: -100,
        opacity: 1,
        duration: 1,
        lazy: true,
    })
    gsap.from('.menu-changer', {
        xPercent: -100,
        opacity: 1,
        duration: 1,
        lazy: true,
    })




    //burger logic
    $('.burger-menu').on('click', function () {
        $(this).toggleClass("burger-menu--opened");
        $(this).toggleClass("burger-menu--closed");
    });
    let menu_layer = document.querySelector('.change-menu');
    if (menu_layer) {
        menu_layer.addEventListener('click', () => {
            if (menu_layer.querySelector('.burger-menu').classList.contains('burger-menu--opened')) {
                gsap.to('.menu-changer', {
                    xPercent: -100,
                    duration: 1,
                    opacity: 1,
                    lazy: true,
                })
                gsap.to('.account-header__burger', {
                    y: -50,
                    lazy: true,
                    duration: 0.2,
                })
                gsap.to('.kitchen-page__navbar', {
                    duration: 0.2,
                    opacity: 0,
                    lazy: true,
                })
                gsap.to('.kitchen-page_scroll', {
                    duration: 0.2,
                    opacity: 0,
                    lazy: true,
                })
            } else {

                gsap.to('.kitchen-page__navbar', {
                    duration: 1,
                    opacity: 1,
                    lazy: true,
                })
                gsap.to('.kitchen-page_scroll', {
                    duration: 1,
                    opacity: 1,
                    lazy: true,
                })

                gsap.to('.menu-changer', {
                    xPercent: 0,
                    duration: 1,
                    opacity: 1,
                    lazy: true,
                })
                gsap.to('.account-header__burger', {
                    y: 0,
                    lazy: true,
                    duration: 0.2,
                })
            }
        })
    }

    //change page animation
    document.querySelectorAll('.change').forEach((el) => {
        el.addEventListener('click', () => {
            gsap.to('.page-changer', {
                xPercent: -100,
                duration: 1,
                opacity: 1,
                lazy: true,
            })
        })
    })
    //links for href click
    document.querySelectorAll(".kitchen_page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "kitchen.html";
            }, 1000)

        })
    })

    document.querySelectorAll(".club-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "book.html";
            }, 1000)

        })
    })
    document.querySelectorAll(".main-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "index.html";
            }, 1000)

        })
    })
    document.querySelectorAll(".sales-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "sales.html";
            }, 1000)

        })
    })
    document.querySelectorAll(".order-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "order.html";
            }, 1000)

        })
    })
    document.querySelectorAll(".account-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "account.html";
            }, 1000)

        })
    })
    document.querySelectorAll(".kitchenin-page").forEach((el) => {
        el.addEventListener('click', () => {
            setTimeout(() => {
                document.location.href = "kitchenin.html";
            }, 1000)

        })
    })

    //animate mousemove
    onReady();
    onReadybook();

    //scroll in kitchen
    if (document.querySelector('.kitchen-page')) {

        $(document).on("scroll", onScroll);

        //scrolltop
        document.querySelector('.kitchen-page_scroll').addEventListener('click', () => {
            $(document).off("scroll");
            $('.kitchen-page__navlink').each(function () {
                $(this).removeClass('active');
            })
            $('.first-link').addClass('active');
            window.scrollTo(0, 0);
            gsap.to('.kitchen-scroll', {
                scrollTrigger: {
                    end: '+=80',
                    scrub: true,
                },
                y: 0, lazy: true,
            })
            gsap.to('.kitchenin-scroll', {
                scrollTrigger: {
                    end: '+=135',
                    scrub: true,
                },
                y: 0, lazy: true,
            })
            document.querySelector('#food').scrollIntoView({ behavior: 'smooth' })
            if (document.querySelector('.kitchen-scroll')) {
                document.querySelector('.kitchen-scroll').style.top = '80px';
            }
            if (document.querySelector('.kitchenin-scroll')) {
                document.querySelector('.kitchenin-scroll').style.top = '135px';
            }
            document.querySelector('.kitchen-page_overflow').style.opacity = 0;
            gsap.to('.kitchen-scroll', {
                scrollTrigger: {
                    end: '+=80',
                    scrub: true,
                },
                y: -80, lazy: true,
            })
            gsap.to('.kitchenin-scroll', {
                scrollTrigger: {
                    end: '+=135',
                    scrub: true,
                },
                y: -135, lazy: true,
            })
            $(document).on("scroll", onScroll);
        })

    }
    //scroll navbar
    $('.kitchen-page__navlink').on('click', function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(document).off("scroll");

        $('.kitchen-page__navlink').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        document.querySelector(target).scrollIntoView({ behavior: 'smooth' })
        if (document.querySelector('.kitchen-scroll')) {
            document.querySelector('.kitchen-scroll').style.top = 0;
        }
        if (document.querySelector('.kitchenin-scroll')) {
            document.querySelector('.kitchenin-scroll').style.top = 0;
        }
        document.querySelector('.kitchen-page_overflow').style.opacity = 0.5;
        if (target != '#food') {
            gsap.to('.kitchen-scroll', {
                scrollTrigger: {
                    end: '+=80',
                    scrub: true,
                },
                y: 0, lazy: true,
            })
            gsap.to('.kitchenin-scroll', {
                scrollTrigger: {
                    end: '+=135',
                    scrub: true,
                },
                y: 0, lazy: true,
            })
        } else {
            if (document.querySelector('.kitchen-scroll')) {
                document.querySelector('.kitchen-scroll').style.top = '80px';
            }
            if (document.querySelector('.kitchenin-scroll')) {
                document.querySelector('.kitchenin-scroll').style.top = '135px';
            }
            document.querySelector('.kitchen-page_overflow').style.opacity = 0;
            gsap.to('.kitchen-scroll', {
                scrollTrigger: {
                    end: '+=80',
                    scrub: true,
                },
                y: -80, lazy: true,
            })
            gsap.to('.kitchenin-scroll', {
                scrollTrigger: {
                    end: '+=135',
                    scrub: true,
                },
                y: -135, lazy: true,
            })
        }
        $(document).on("scroll", onScroll);
    });
    if (document.querySelector('.kitchen-modal')) {
        //plus order counter
        document.querySelectorAll('.kitchen-modal__plus').forEach(el => {
            let price = +el.parentElement.parentElement.querySelector('.kitchen-modal__price span').innerHTML;
            el.addEventListener('click', () => {
                let counter = +el.parentElement.querySelector('.kitchen-modal__count').innerHTML;
                counter++;
                el.parentElement.querySelector('.kitchen-modal__count').innerHTML = counter;
                let sum = price * counter;
                el.parentElement.parentElement.querySelector('.kitchen-modal__price span').innerHTML = sum;
                let final_sum = 0;
                document.querySelectorAll('.kitchen-modal__price span').forEach(el => {
                    final_sum = final_sum + +el.innerHTML;
                    document.querySelector('.order-sum span').innerHTML = final_sum
                })
            })

        })
        //minus order counter
        document.querySelectorAll('.kitchen-modal__minus').forEach(el => {
            let price = +el.parentElement.parentElement.querySelector('.kitchen-modal__price span').innerHTML;
            el.addEventListener('click', () => {
                let counter = +el.parentElement.querySelector('.kitchen-modal__count').innerHTML;
                if (counter > 0) {
                    counter--;
                }
                el.parentElement.querySelector('.kitchen-modal__count').innerHTML = counter;
                let sum = price * counter;
                el.parentElement.parentElement.querySelector('.kitchen-modal__price span').innerHTML = sum;
                let final_sum = 0;
                document.querySelectorAll('.kitchen-modal__price span').forEach(el => {
                    final_sum = final_sum + +el.innerHTML;
                    document.querySelector('.order-sum span').innerHTML = final_sum
                })
            })

        })
        let final_sum = 0;
        document.querySelectorAll('.kitchen-modal__price span').forEach(el => {
            final_sum = final_sum + +el.innerHTML;
            document.querySelector('.order-sum span').innerHTML = final_sum
        })
    }

    gsap.to('.kitchen-scroll', {
        scrollTrigger: {
            end: '+=80',
            scrub: true,
        },
        y: -80, lazy: true,
    })
    gsap.to('.kitchenin-scroll', {
        scrollTrigger: {
            end: '+=135',
            scrub: true,
        },
        y: -135, lazy: true,
    })
    gsap.to('.kitchen-page_overflow', {
        scrollTrigger: {
            end: '+=80',
            scrub: true,
        },
        opacity: 0.5, lazy: true,
    })

    if (window.innerWidth < 768) {
        gsap.to('.kitchen-round', {
            scrollTrigger: {
                // trigger: '#food',
                //  start: "50% bottom",
                scrub: true,

            },
            yPercent: 500, lazy: true, duration: 20
        })
    } else {
        gsap.to('.kitchen-round', {
            scrollTrigger: {
                trigger: '#drink',
                start: "0% bottom",
                scrub: true,

            },
            yPercent: 40, lazy: true
        })
    }



    smoothScroll(".smooth-scroll");

    //history table
    if (document.querySelector('.account')||document.querySelector('.order-slider__place')) {




        getPagination('#table-id');
        //getPagination('.table-class');
        //getPagination('table');

        /*					PAGINATION 
        - on change max rows select options fade out all rows gt option value mx = 5
        - append pagination list as per numbers of rows / max rows option (20row/5= 4pages )
        - each pagination li on click -> fade out all tr gt max rows * li num and (5*pagenum 2 = 10 rows)
        - fade out all tr lt max rows * li num - max rows ((5*pagenum 2 = 10) - 5)
        - fade in all tr between (maxRows*PageNum) and (maxRows*pageNum)- MaxRows 
        */


        function getPagination(table) {
            var lastPage = 1;
let rows=5;
if (document.querySelector('.order-slider')) rows=5;
            $('#maxRows')
                .on('change', function (evt) {
                    //$('.paginationprev').html('');						// reset pagination

                    lastPage = 1;
                    $('.pagination')
                        .find('li')
                        .slice(1, -1)
                        .remove();
                    var trnum = 0; // reset tr counter
                    var maxRows = parseInt($(this).val()); // get Max Rows from select option

                    if (maxRows == 5000) {
                        $('.pagination').hide();
                    } else {
                        $('.pagination').show();
                    }

                    var totalRows = $(table + ' tbody tr').length; // numbers of rows
                    $(table + ' tr:gt(0)').each(function () {
                        // each TR in  table and not the header
                        trnum++; // Start Counter
                        if (trnum > maxRows) {
                            // if tr number gt maxRows

                            $(this).hide(); // fade it out
                        }
                        if (trnum <= maxRows) {
                            $(this).show();
                        } // else fade in Important in case if it ..
                    }); //  was fade out to fade it in
                    if (totalRows > maxRows) {
                        // if tr total rows gt max rows option
                        var pagenum = Math.ceil(totalRows / maxRows); // ceil total(rows/maxrows) to get ..
                        //	numbers of pages
                        for (var i = 1; i <= pagenum;) {
                            // for each page append pagination li
                            $('.pagination #prev')
                                .before(
                                    '<li data-page="' +
                                    i +
                                    '">\
                  <span>' +
                                    i++ +
                                    '<span class="sr-only"></span></span>\
                </li>'
                                )
                                .show();
                        } // end for i
                    } // end if row count > max rows
                    $('.pagination [data-page="1"]').addClass('active'); // add active class to the first li
                    $('.pagination li').on('click', function (evt) {
                        // on click each page
                        evt.stopImmediatePropagation();
                        evt.preventDefault();
                        var pageNum = $(this).attr('data-page'); // get it's number

                        var maxRows = parseInt($('#maxRows').val()); // get Max Rows from select option

                        if (pageNum == 'prev') {
                            if (lastPage == 1) {
                                return;
                            }
                            pageNum = --lastPage;
                        }
                        if (pageNum == 'next') {
                            if (lastPage == $('.pagination li').length - 2) {
                                return;
                            }
                            pageNum = ++lastPage;
                        }

                        lastPage = pageNum;
                        var trIndex = 0; // reset tr counter
                        $('.pagination li').removeClass('active'); // remove active class from all li
                        $('.pagination [data-page="' + lastPage + '"]').addClass('active'); // add active class to the clicked
                        // $(this).addClass('active');					// add active class to the clicked
                        limitPagging();
                        $(table + ' tr:gt(0)').each(function () {
                            // each tr in table not the header
                            trIndex++; // tr index counter
                            // if tr index gt maxRows*pageNum or lt maxRows*pageNum-maxRows fade if out
                            if (
                                trIndex > maxRows * pageNum ||
                                trIndex <= maxRows * pageNum - maxRows
                            ) {
                                $(this).hide();
                            } else {
                                $(this).show();
                            } //else fade in
                        }); // end of for each tr in table
                    }); // end of on click pagination list
                    limitPagging();
                })
                .val(rows)
                .change();

            // end of on select change

            // END OF PAGINATION
        }

        function limitPagging() {
            // alert($('.pagination li').length)

            if ($('.pagination li').length > 7) {
                if ($('.pagination li.active').attr('data-page') <= 3) {
                    $('.pagination li:gt(5)').hide();
                    $('.pagination li:lt(5)').show();
                    $('.pagination [data-page="next"]').show();
                } if ($('.pagination li.active').attr('data-page') > 3) {
                    $('.pagination li:gt(0)').hide();
                    $('.pagination [data-page="next"]').show();
                    for (let i = (parseInt($('.pagination li.active').attr('data-page')) - 2); i <= (parseInt($('.pagination li.active').attr('data-page')) + 2); i++) {
                        $('.pagination [data-page="' + i + '"]').show();

                    }

                }
            }
        }

        $(function () {
            // Just to append id number for each row
            $('table tr:eq(0)').prepend('<th class="account__id"> ID </th>');

            var id = 0;

            $('table tr:gt(0)').each(function () {
                id++;
                $(this).prepend('<td>' + id + '</td>');
            });
        });

        const getSort = ({ target }) => {
            const order = (target.dataset.order = -(target.dataset.order || -1));
            const index = [...target.parentNode.cells].indexOf(target);
            const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
            const comparator = (index, order) => (a, b) => order * collator.compare(
                a.children[index].innerHTML,
                b.children[index].innerHTML
            );

            for (const tBody of target.closest('table').tBodies)
                tBody.append(...[...tBody.rows].sort(comparator(index, order)));

            for (const cell of target.parentNode.cells)
                cell.classList.toggle('sorted', cell === target);
        };
        if (document.querySelector('.account')){
            setTimeout(() => {
                document.querySelector('.account__id').click();
                document.querySelector('.account__id').click();
            }, 500)
        }


        document.querySelectorAll('.account__table thead').forEach(tableTH => tableTH.addEventListener('click', () => { getSort(event); console.log(event) }));

    }
    if (document.querySelector('.landing')) {

        $('.hall__slider').slick({
            slidesToShow: 1.5,
            slidesToScroll: 1,
            arrows: true,
            autoplay: true,
            fade: false,
        });
        $('.order-slider').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            fade: true,
        });
        if (document.querySelector('.order-slider')) {
            document.querySelector('.slick-prev').innerHTML =
                `
            <a class="order-slider__btn btn game-p1 change">
            Назад
            <span class="top"></span>
            <span class="left"></span>
            <span class="bottom"></span>
            <span class="right"></span>
        </a>
            `
            document.querySelector('.slick-next').innerHTML =
                `
            <a class="order-slider__btn btn game-p1 change">
            Далее
            <span class="top"></span>
            <span class="left"></span>
            <span class="bottom"></span>
            <span class="right"></span>
        </a>
            `

            $('.location-slider').slick({
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                arrows: true,
                fade: false,
            });

            $('select').each(function(){
                var $this = $(this), numberOfOptions = $(this).children('option').length;
              
                $this.addClass('select-hidden'); 
                $this.wrap('<div class="select"></div>');
                $this.after('<div class="select-styled"></div>');
            
                var $styledSelect = $this.next('div.select-styled');
                $styledSelect.text($this.children('option').eq(0).text());
              
                var $list = $('<ul />', {
                    'class': 'select-options'
                }).insertAfter($styledSelect);
              
                for (var i = 0; i < numberOfOptions; i++) {
                    $('<li />', {
                        text: $this.children('option').eq(i).text(),
                        rel: $this.children('option').eq(i).val()
                    }).appendTo($list);
                    //if ($this.children('option').eq(i).is(':selected')){
                    //  $('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('is-selected')
                    //}
                }
              
                var $listItems = $list.children('li');
              
                $styledSelect.click(function(e) {
                    e.stopPropagation();
                    $('div.select-styled.active').not(this).each(function(){
                        $(this).removeClass('active').next('ul.select-options').hide();
                    });
                    $(this).toggleClass('active').next('ul.select-options').toggle();
                });
              
                $listItems.click(function(e) {
                    e.stopPropagation();
                    $styledSelect.text($(this).text()).removeClass('active');
                    $this.val($(this).attr('rel'));
                    $list.hide();
                    //console.log($this.val());
                });
              
                $(document).click(function() {
                    $styledSelect.removeClass('active');
                    $list.hide();
                });
            
            });
            if (document.querySelector('.date-table')){
            ////-----calendar
            var Cal = function (divId) {

                //Store div id
                this.divId = divId;

                // Days of week, starting on Sunday
                this.DaysOfWeek = [
                    'Sun',
                    'Mon',
                    'Tue',
                    'Wed',
                    'Thu',
                    'Fri',
                    'Sat'
                ];

                // Months, stating on January
                this.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

                // Set the current month, year
                var d = new Date();

                this.currMonth = d.getMonth();
                this.currYear = d.getFullYear();
                this.currDay = d.getDate();

            };

            // Goes to next month
            Cal.prototype.nextMonth = function () {
                if (this.currMonth == 11) {
                    this.currMonth = 0;
                    this.currYear = this.currYear + 1;
                }
                else {
                    this.currMonth = this.currMonth + 1;
                }
                this.showcurr();
            };

            //   Goes to previous month
            Cal.prototype.previousMonth = function () {
                if (this.currMonth == 0) {
                    this.currMonth = 11;
                    this.currYear = this.currYear - 1;
                }
                else {
                    this.currMonth = this.currMonth - 1;
                }
                this.showcurr();
            };

            // Show current month
            Cal.prototype.showcurr = function () {
                this.showMonth(this.currYear, this.currMonth);
            };

            // Show month (year, month)
            Cal.prototype.showMonth = function (y, m) {

                var d = new Date()
                    // First day of the week in the selected month
                    , firstDayOfMonth = new Date(y, m, 1).getDay()
                    // Last day of the selected month
                    , lastDateOfMonth = new Date(y, m + 1, 0).getDate()
                    // Last day of the previous month
                    , lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

                var html = '<table>';

                // Write selected month and year
                html += '<thead><tr>';
                html += '<td colspan="7">' + this.Months[m] + ' ' + y + '</td>';
                html += '</tr></thead>';


                // Write the header of the days of the week
                html += '<tr class="days">';
                for (var i = 0; i < this.DaysOfWeek.length; i++) {
                    html += '<td>' + this.DaysOfWeek[i] + '</td>';
                }
                html += '</tr>';


                // Write the days
                var i = 1;
                do {

                    var dow = new Date(y, m, i).getDay();

                    // If Sunday, start new row
                    if (dow == 0) {
                        html += '<tr>';
                    }
                    // If not Sunday but first day of the month
                    // it will write the last days from the previous month
                    else if (i == 1) {
                        html += '<tr>';
                        var k = lastDayOfLastMonth - firstDayOfMonth + 1;
                        for (var j = 0; j < firstDayOfMonth; j++) {
                            html += '<td class="disabled">' + k + '</td>';
                            k++;
                        }
                    }

                    // Write the current day in the loop
                    var chk = new Date();
                    var chkY = chk.getFullYear();
                    var chkM = chk.getMonth();
                    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
                        html += '<td class="today date-td"><div class="date-table__check"><img src="./img/tick.png" alt="agreed"></div>' + i + '</td>';
                    } else if (i < this.currDay && chkM == this.currMonth) {
                        html += '<td class="normal disabled"><div class="date-table__check"><img src="./img/tick.png" alt="agreed"></div>' + i + '</td>';
                    } else {
                        html += '<td class="normal date-td"><div class="date-table__check"><img src="./img/tick.png" alt="agreed"></div>' + i + '</td>';
                    }
                    // If Saturday, closes the row
                    if (dow == 6) {
                        html += '</tr>';
                    }
                    // If not Saturday, but last day of the selected month
                    // it will write the next few days from the next month
                    else if (i == lastDateOfMonth) {
                        var k = 1;
                        for (dow; dow < 6; dow++) {
                            html += '<td class="not-current date-td"><div class="date-table__check"><img src="./img/tick.png" alt="agreed"></div>' + k + '</td>';
                            k++;
                        }
                    }

                    i++;
                } while (i <= lastDateOfMonth);

                // Closes table
                html += '</table>';

                // Write HTML to the div
               document.getElementById(this.divId).innerHTML = html;
            };

            // On Load of the window
            window.onload = function () {

                // Start calendar
                var c = new Cal("divCal");
                c.showcurr();

                // Bind next and previous button clicks
                getId('btnNext').onclick = function () {
                    c.nextMonth();
                    //order date choice
                    setTimeout(() => {
                        document.querySelectorAll('.date-td').forEach(el => {
                            el.addEventListener('click', () => {
                                document.querySelectorAll('.date-td').forEach(el => {
                                    el.querySelector('.date-table__check').classList.remove('show')
                                })
                                if (el.querySelector('.date-table__check')) {
                                    el.querySelector('.date-table__check').classList.toggle('show')
                                }
                            })
                        })
                    }, 1000)
                };
                getId('btnPrev').onclick = function () {
                    c.previousMonth();
                    //order date choice
                    setTimeout(() => {
                        document.querySelectorAll('.date-td').forEach(el => {
                            el.addEventListener('click', () => {
                                document.querySelectorAll('.date-td').forEach(el => {
                                    el.querySelector('.date-table__check').classList.remove('show')
                                })
                                if (el.querySelector('.date-table__check')) {
                                    el.querySelector('.date-table__check').classList.toggle('show')
                                }
                            })
                        })
                    }, 1000)
                };
            }

            // Get element by id
            function getId(id) {
                return document.getElementById(id);
            }
        }
            ////-----


            //order location choice
            document.querySelectorAll('.location-slider__slide').forEach(el => {

                el.addEventListener('click', () => {
                    if (!el.classList.contains('disabled')) {
                        document.querySelectorAll('.location-slider__slide').forEach(el => {
                            el.querySelector('.location-slider__check').classList.remove('show')
                        })
                        el.querySelector('.location-slider__check').classList.toggle('show')
                        setTimeout(()=>{
                            document.querySelector('.slick-next').click();
                            document.querySelectorAll('.slick-arrow').forEach(el=>{
                                el.style.opacity=1;
                            })
                        },500)
                    }

                })
            })
            //order place choice
            document.querySelectorAll('.place-table__add').forEach(el => {
                el.addEventListener('click', () => {
                    if (!el.parentElement.classList.contains('disabled')) {
                        if (el.querySelector('.place-table__check')) {
                            el.querySelector('.place-table__check').classList.toggle('show')
                            el.querySelector('.btn').classList.toggle('hidden');
                            if (el.querySelector('.btn').classList.contains('hidden')){
                                el.parentElement.style.opacity=0.5
                            } else {
                                el.parentElement.style.opacity=1
                            }
                        
                        }
                    }
                })
            })
            //order date choice
            setTimeout(() => {
                document.querySelectorAll('.date-td').forEach(el => {
                    el.addEventListener('click', () => {
                        document.querySelectorAll('.date-td').forEach(el => {
                            el.querySelector('.date-table__check').classList.remove('show')
                        })
                        if (el.querySelector('.date-table__check')) {
                            el.querySelector('.date-table__check').classList.toggle('show')
                        }
                    })
                })
            }, 1000)
            //order time choice
            document.querySelectorAll('.time-table__li').forEach(el => {
                el.addEventListener('click', () => {
                    if (!el.classList.contains('disabled')) {
                        if (el.querySelector('.time-table__check')) {
                            el.querySelector('.time-table__check').classList.toggle('show')
                        }
                    }
                })
            })
        }
        gsap.from('.hall__slider', {
            scrollTrigger: {
                trigger: '.hall',
                start: "10% bottom",
                end: "40% top",
                scrub: true,
            },
            x: -300, lazy: true, opacity: 0,
        })


        gsap.from('.map__contacts', {
            scrollTrigger: {
                trigger: '.map',
                start: "10% bottom",
                end: "+=500",
                scrub: true,
            },
            x: -300, lazy: true,
        })

        gsap.to('.round', {
            scrollTrigger: {
                trigger: '.price',
                start: "0% bottom",
                scrub: true,

            },
            yPercent: -100, lazy: true,
        })



        gsap.to('.quadro', {
            scrollTrigger: {
                trigger: '.hall',
                start: "10% bottom",
                scrub: true,

            },
            x: -400, lazy: true,


        })

        gsap.to('.rectangle', {
            scrollTrigger: {
                trigger: '.rectangle',
                start: "top bottom",
                scrub: true,

            },
            rotate: 360, lazy: true,


        })

        gsap.to('.account-cloud', {
            scrollTrigger: {
                trigger: '.result-content',
                start: "top bottom",
                scrub: true,

            },
            rotate: 360, lazy: true,
        })
        gsap.to('.account_cloud', {
            scrollTrigger: {
                trigger: '.account',
                start: "10% bottom",
                scrub: true,

            },
            y: 500, lazy: true,
        })

        gsap.utils.toArray(".sales-left").forEach((section, i) => {
            TweenMax.from(section, {
                opacity: 0,
                xPercent: -50,
                lazy: true,
                scrollTrigger: {
                    trigger: section,
                    start: "0% bottom",
                    end: "70% bottom",
                    scrub: true,
                },
            });
        })
        gsap.utils.toArray(".sales-right").forEach((section, i) => {
            TweenMax.from(section, {
                opacity: 0,
                xPercent: 50,

                lazy: true,
                scrollTrigger: {
                    trigger: section,
                    start: "0% bottom",
                    end: "70% bottom",
                    scrub: true,
                },
            });
        })

        gsap.to('.sales-cloud', {
            scrollTrigger: {
                trigger: '.sales',
                start: "50% bottom",
                scrub: true,

            },
            y: 500, lazy: true,
        })
        gsap.to('.kitchen1', {
            scrollTrigger: {
                trigger: '.kitchen',
                start: "10% bottom",
                end: "100% top",
                scrub: true,
            },
            y: -200, lazy: true,


        })

        gsap.to('.kitchen2', {
            scrollTrigger: {
                trigger: '.kitchen',
                start: "50% bottom",
                end: "100% top",
                scrub: true,
            },
            y: 200, lazy: true,
        })

        gsap.to('.equip2', {
            scrollTrigger: {
                trigger: '.equip',
                start: "60% bottom",
                scrub: true,
            },
            y: 150, lazy: true,
        })


    }


    // auth
    if (document.querySelector('.auth')) {
        let button_toggle = document.querySelector('.auth')
        let input_phone = document.querySelector('.phone')
        let input_toggle = document.querySelector('.password')
        let button_again = document.querySelector('.again')
        button_toggle.addEventListener('click', () => {
            button_toggle.classList.add('hide');
            input_phone.classList.add('hide')
            input_toggle.classList.remove('hide')
            button_again.classList.remove('hide')
        })
        button_again.addEventListener('click', () => {
            button_toggle.classList.remove('hide');
            input_phone.classList.remove('hide')
            input_toggle.classList.add('hide')
            button_again.classList.add('hide')
        })

        //auth
        document.querySelector('.password').addEventListener('keypress', (el) => {
            if (el.keyCode === 13 || el.which === 13) {
                gsap.to('.page-changer', {
                    xPercent: -100,
                    duration: 1,
                    opacity: 1,
                    lazy: true,
                })
                setTimeout(() => {
                    document.location.href = "account.html";
                }, 1000)
            }

        })
    }



})





//phone autoform

function regular() {
    let pattern = /(\+7|8)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/g;
    document.querySelector("#viewport").innerHTML = document.querySelector("#viewport").innerHTML.replace(pattern, '+7($2)$3-$4-$5');
}
if ((!document.querySelector(".map__container"))) {
    regular();
}

//phone mask for form
var phoneInput = document.querySelectorAll('.phone')
phoneInput.forEach(el =>
    el.addEventListener('keydown', function (event) {
        if (!(event.key == 'ArrowLeft' || event.key == 'ArrowRight' || event.key == 'Backspace' || event.key == 'Tab')) { event.preventDefault() }
        var mask = '+7 (111) 111-11-11'; // Задаем маску
        if (/[0-9\+\ \-\(\)]/.test(event.key)) {
            // Здесь начинаем сравнивать this.value и mask
            // к примеру опять же
            var currentString = this.value;
            var currentLength = currentString.length;
            if (/[0-9]/.test(event.key)) {
                if (mask[currentLength] == '1') {
                    this.value = currentString + event.key;
                } else {
                    for (var i = currentLength; i < mask.length; i++) {
                        if (mask[i] == '1') {
                            this.value = currentString + event.key;
                            break;
                        }
                        currentString += mask[i];
                    }
                }
            }
        }
    }));



