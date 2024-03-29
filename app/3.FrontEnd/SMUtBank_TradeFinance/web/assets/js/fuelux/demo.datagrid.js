! function($) {

    $(function() {

        // fuelux datagrid
        var DataGridDataSource = function(options) {
            this._formatter = options.formatter;
            this._columns = options.columns;
            this._delay = options.delay;
        };

        DataGridDataSource.prototype = {

            columns: function() {
                return this._columns;
            },

            data: function(options, callback) {
                var url = 'assets/js/data/datagrid.json';
                var self = this;

                setTimeout(function() {

                    var data = $.extend(true, [], self._data);

                    $.ajax(url, {
                        dataType: 'json',
                        //async: false,
                        type: 'GET'
                    }).done(function(response) {

                        data = response.geonames;
                        // SEARCHING
                        if (options.search) {
                            data = _.filter(data, function(item) {
                                var match = false;

                                _.each(item, function(prop) {
                                    if (_.isString(prop) || _.isFinite(prop)) {
                                        if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                                    }
                                });

                                return match;
                            });
                        }

                        // FILTERING
                        if (options.filter) {
                            console.log(options.filter.value);
                            data = _.filter(data, function(item) {
                                switch (options.filter.value) {
                                    case 'lt5m':
                                        if (item.population < 5000000) return true;
                                        break;
                                    case 'gte5m':
                                        if (item.population >= 5000000) return true;
                                        break;
                                    default:
                                        return true;
                                        break;
                                }
                                /*switch (options.filter.value) {
                                    case 'Norway':
                                        if (item.ship_destination === "Norway") return true;
                                        break;
                                    case 'UK':
                                        if (item.ship_destination === "UK") return true;
                                        break;
                                    default:
                                        return true;
                                        break;
                                }*/
                            });
                        }

                        var count = data.length;

                        // SORTING
                        if (options.sortProperty) {
                            data = _.sortBy(data, options.sortProperty);
                            if (options.sortDirection === 'desc') data.reverse();
                        }

                        // PAGING
                        console.log(options.pageIndex);
                        console.log(options.pageSize);

                        var startIndex = options.pageIndex * options.pageSize;
                        console.log(startIndex);
                        var endIndex = startIndex + options.pageSize;
                        console.log(endIndex);
                        var end = (endIndex > count) ? count : endIndex;
                        console.log(end);
                        var pages = Math.ceil(count / options.pageSize);
                        console.log(pages);
                        var page = options.pageIndex + 1;
                        console.log(page);
                        var start = startIndex + 1;
                        console.log(start);
                        data = data.slice(startIndex, endIndex);

                        if (self._formatter) self._formatter(data);

                        callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                    }).fail(function(e) {

                    });
                }, self._delay);
            }
        };

        $('#MyStretchGrid').each(function() {
            $(this).datagrid({
                dataSource: new DataGridDataSource({
                    // Column definitions for Datagrid
                    columns: [{
                            property: 'toponymName',
                            label: 'Name',
                            sortable: true
                        },
                        {
                            property: 'countrycode',
                            label: 'Country',
                            sortable: true
                        },
                        {
                            property: 'population',
                            label: 'Population',
                            sortable: true
                        },
                        {
                            property: 'fcodeName',
                            label: 'Type',
                            sortable: true
                        },
                        {
                            property: 'geonameId',
                            label: 'Edit',
                            sortable: true
                        }
                    ],

                    // Create IMG tag for each returned image
                    formatter: function(items) {
                        $.each(items, function(index, item) {
                            '<a href="modal.html?geonameid=' + item.geonameId + '" data-toggle="ajaxModal" ><i class="fa fa-pencil"></i></a>';
                        });
                    }
                })
            });
        });

    });
}(window.jQuery);