(function ($) {
    $(function () {
        var common = {
            init: function () {
                //cache dom
                this.$html = $('html');
                this.$body = $('body');
                this.$pageLoader = $('#page-loader');


                //event handlers
                //setTimeout(this.hideLoader.bind(this), 800);
                $(window).on('load', this.hideLoader.bind(this));
            },
            hideLoader: function () {
                this.$pageLoader.hide();
            }
        };
        var mainNavigation = (function () {

            //cache dom
            var $navMenu = $(document).find('.navigation-custom');
            var $menuOpenTrigger = $(document).find('.nav-trigger');

            var init = function () {
                //event triggers
                $menuOpenTrigger.on('click', 'a', openMenu);
                $navMenu.on('click', '.close-menu a', closeMenu);
                $(document).on('keyup', closeMenu);
            };

            var openMenu = function () {
                $navMenu.addClass('menu-open');
            };

            var closeMenu = function (e) {
                if (typeof e === 'object') {
                    if (e.type === 'key' && e.key !== 'Escape') {
                        return;
                    }
                }
                //this.$navMenu.addClass('menu-closed');
                $navMenu.removeClass('menu-open');
            };

            return {
                init: init
            }

        })();
        var backToTop = {
            init: function () {
                //cache dom
                this.$html = $('html');
                this.$header = $('#masthead');

                //calculate on page ready
                this.headerHeight = this.$header.outerHeight();
                this.backToTopButton = $('#back-to-top');

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
        //console.log(mainNavigation);
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
                this.$pagination = this.$paginationContainer.find('.page-numbers');

                this.$itemFilters = this.$mainContainer.find('.item-filters');
                //console.log(this.$pagination);
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
            'contact-page': {
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
        WEN_JS_UTIL.loadEvents();
    });
})(jQuery);