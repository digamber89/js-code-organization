(function ($) {

    var common = {
        init: function () {
            this.cacheDOM();
            this.eventListeners();
        },
        cacheDOM: function () {
            //cache dom
            this.$window = $(window);
            this.$html = $('html');
            this.$body = $('body');
            this.$pageLoader = $('#page-loader');

            // data that would need recalculation on window width
            this.windowWidth = $(window).width();

        },
        eventListeners: function () {
            //event handlers
            //setTimeout(this.hideLoader.bind(this), 2000);
            $(window).on('load', this.hideLoader.bind(this));
            $(window).on('resize', this.updateDetailsOnResize.bind(this));
        },
        hideLoader: function () {
            this.$pageLoader.hide();
        },
        updateDetailsOnResize: function () {
            this.windowWidth = this.$window.width();
        }
    };


    var backToTop = {
        init: function () {
            this.cacheDOM();
            this.eventListeners();
        },
        cacheDOM: function () {
            //cache dom
            this.$html = $('html');
            this.$header = $('#masthead');

            //calculate on page ready
            this.windowWidth = $(window).width();
            this.headerHeight = this.$header.outerHeight();
            this.backToTopButton = $('#back-to-top');
        },
        eventListeners: function () {
            //event listeners
            $(window).on('scroll', this.toggleShowBackToTopButton.bind(this));
            this.backToTopButton.on('click', this.backToTop.bind(this));
        },
        toggleShowBackToTopButton: function () {
            var windowScrolled = this.$html.scrollTop();
            if (windowScrolled > this.headerHeight) {
                this.backToTopButton.show();
            } else {
                this.backToTopButton.hide();
            }
        },
        backToTop: function (e) {
            e.preventDefault();
            this.$html.stop().animate({scrollTop: 0}, 'slow');
            //return false;
        }
    };

    var mainNavigation = {
        init: function () {
            //cache dom
            this.$navMenu = $(document).find('.navigation-custom');
            this.$menuOpenTrigger = $(document).find('.nav-trigger');
            this.$parentMenu = this.$navMenu.find('li.menu-item-has-children a');
            this.windowWidth = $(window).width();


            //event triggers
            this.$menuOpenTrigger.on('click', 'a', this.openMenu.bind(this));
            this.$navMenu.on('click', '.close-menu a', this.closeMenu.bind(this));
            $(document).on('keyup', this.closeMenu.bind(this));

            this.$parentMenu.on('click', this.showSubMenu.bind(this));

        },
        showSubMenu: function (e) {
            if (common.windowWidth <= 567) {
                //preventDefault needs to be within condition otherwise it will fire on all screens
                e.preventDefault();
                var $el = $(e.currentTarget);
                $el.next('ul.sub-menu').slideToggle();
            }
        },
        openMenu: function () {
            this.$navMenu.addClass('menu-open');
        },
        closeMenu: function (e) {

            if (typeof e === 'object') {
                if (e.type === 'keyup' && e.key !== 'Escape') {
                    return false;
                }
            }
            //this.$navMenu.addClass('menu-closed');
            this.$navMenu.removeClass('menu-open');
        }
    };

    var digthisListItems = {
        init: function () {
            // cache dom elements
            this.cacheDom();
            this.eventListeners();
        },
        cacheDom: function () {
            this.$mainContainer = $('.digthis-list-container');
            this.$filterForm = this.$mainContainer.find('.filter-items form');
            this.$itemContainer = this.$mainContainer.find('.item-container');
            this.$paginationContainer = this.$mainContainer.find('.pagination');
            this.$itemFilters = this.$mainContainer.find('.item-filters');
        },
        eventListeners: function () {
            this.$filterForm.on('submit', this.getSearchResult.bind(this));
            this.$paginationContainer.on('click', 'ul.page-numbers .page-numbers:not(.current)', this.getPageNumber.bind(this));
            this.$itemFilters.on('change', '#category', this.filterItems.bind(this));
        },
        getPageNumber: function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget);
            var pageNumber = $el.text();
            var baseUrl = this.$mainContainer.data('baseurl');
            var filterOptions = {show_page: pageNumber, base_page: baseUrl};
            this.getItems(filterOptions);
        },
        getSearchResult: function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget);
            var searchTerm = $el.find('.search').val();
            var filterOptions = {search_term: searchTerm};
            this.getItems(filterOptions);
        },
        getItems: function (filterOptions) {
            $.ajax({
                context: this,//same as bind this
                url: JSC.ajaxUrl,
                type: 'POST',
                data: {action: 'digthis_get_items', filters: filterOptions},
                beforeSend: function () {

                },
                success: function (response) {
                    console.log(response.data);
                    if (response.success === true) {
                        if (response.data.listHTML) {
                            this.renderItems(response.data.listHTML, response.data.pagination);
                        }
                    } else {
                        this.renderItems(response.data.message, '');
                    }
                }
            })
        },
        filterItems: function (e) {
            e.preventDefault();
            var $el = $(e.currentTarget);
            var category_id = $el.val();
            this.getItems({category_id: category_id});
        },
        renderItems: function (listHTML, pagination) {
            //place the items found
            this.$itemContainer.html(listHTML);
            //replace the pagination
            this.$paginationContainer.html(pagination);
        }
    };

    //JSCODEORGANIZATION - replace with project name
    //e.g. stealth become STEALTH
    var JSCODEORGANIZATION = {
        common: {
            init: function () {
                console.log('at the beginning of document ready');
                common.init();

                //backToTop
                backToTop.init();

                //menu trigger
                mainNavigation.init();

                digthisListItems.init();
            },
            finalize: function () {
                console.log('at the end of document ready');
            }
        },
        'home': {
            init: function () {
                //alert('I am glad we can help');
            }
        }
    };

    //common UTIL this doesn't change
    var WEN_JS_UTIL = {

        fire: function (func, funcname, args) {
            var namespace = JSCODEORGANIZATION; // indicate your obj literal namespace here for standard lets make it abbreviation of current project

            funcname = (funcname === undefined) ? 'init' : funcname;
            if (func !== '' && namespace[func] && typeof namespace[func][funcname] === 'function') {
                namespace[func][funcname](args);
            }

        },

        loadEvents: function () {

            var bodyId = document.body.id;

            // hit up common first.
            WEN_JS_UTIL.fire('common');

            // do all the classes too.
            $.each(document.body.className.split(/\s+/), function (i, classnm) {
                WEN_JS_UTIL.fire(classnm);
                WEN_JS_UTIL.fire(classnm, bodyId);
            });

            WEN_JS_UTIL.fire('common', 'finalize');

        }
    };

    $(function () {
        WEN_JS_UTIL.loadEvents();
    });

})(jQuery);