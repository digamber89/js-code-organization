(function ($) {

    var mainNavigation = {
        init: function () {
            //cache dom
            this.$navMenu = $(document).find('.navigation-custom');
            this.$menuOpenTrigger = $(document).find('.nav-trigger');

            //event triggers
            this.$menuOpenTrigger.on('click', 'a', this.openMenu.bind(this));
            this.$navMenu.on('click', '.close-menu a', this.closeMenu.bind(this));
        },
        openMenu: function () {
            this.$navMenu.removeClass('menu-closed');
            this.$navMenu.addClass('menu-open');
        },
        closeMenu: function () {
            this.$navMenu.addClass('menu-closed');
            //this.$navMenu.removeClass('menu-open');
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
                console.log('test');
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