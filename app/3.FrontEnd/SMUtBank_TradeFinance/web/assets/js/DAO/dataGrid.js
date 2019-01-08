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

            data: async function(options, callback) {
                //var url = '../assets/js/data/datagrid.json';
                var self = this;

                // setTimeout(function() {

                var data = $.extend(true, [], self._data);
                const results = await getAllLcDetailsShipperArray();
                //var dataObj = JSON.parse(results);
                data = results;
                console.log(data);
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

                            case 'Norway':
                                if (item.ship_destination === "Norway") return true;
                                break;
                            case 'UK':
                                if (item.ship_destination === "UK") return true;
                                break;
                            default:
                                return true;
                                break;
                        }
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

                console.log(data);
                callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                /*    $.ajax(url, {
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
                            data = _.filter(data, function(item) {
   
                                switch (options.filter.value) {
                                    case 'Norway':
                                        if (item.ship_destination === "Norway") return true;
                                        break;
                                    case 'UK':
                                        if (item.ship_destination === "UK") return true;
                                        break;
                                    default:
                                        return true;
                                        break;
                                }
                            });
                        }

                        var count = data.length;

                        // SORTING
                        if (options.sortProperty) {
                            data = _.sortBy(data, options.sortProperty);
                            if (options.sortDirection === 'desc') data.reverse();
                        }

                        // PAGING
                        var startIndex = options.pageIndex * options.pageSize;
                        var endIndex = startIndex + options.pageSize;
                        var end = (endIndex > count) ? count : endIndex;
                        var pages = Math.ceil(count / options.pageSize);
                        var page = options.pageIndex + 1;
                        var start = startIndex + 1;

                        data = data.slice(startIndex, endIndex);

                        if (self._formatter) self._formatter(data);

                        callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                    }).fail(function(e) {

                    }); */
                // }, self._delay);
            }
        };

        $('#MyStretchGrid').each(function() {
            $(this).datagrid({
                dataSource: new DataGridDataSource({
                    // Column definitions for Datagrid
                    columns: [{
                            property: 'ref_num',
                            label: 'Ref Num',
                            sortable: true
                        },
                        {
                            property: 'ship_destination',
                            label: 'Ship Destination',
                            sortable: true
                        },
                        {
                            property: 'ship_date',
                            label: 'Ship Date',
                            sortable: true
                        },
                        {
                            property: 'status',
                            label: 'Status',
                            sortable: true
                        },

                    ],

                    // Create IMG tag for each returned image
                    formatter: function(items) {
                        $.each(items, function(index, item) {
                            console.log(item);
                            //Get operation - Call operationMatch method,  returns [action, url] based on user type (e.g.["view lc", "viewLc.html"])
                            //var operations = operationMatch(item.status); //calling this method from utility/operationMatch.js
                            //var operation = operations[0]; //get action to take
                            //var url = operations[1];

                            /*Button triggers lcDetails modal by default, 
                            lcDetails, operation,refNum,receipt,link,status are all stored in the modal data variable*/
                            /*    item =    "<button type='button'  class='btn btn-primary lcDetails'  data-toggle='modal' data-target='#lcDetailsModal' data-bcreceipt='" +
                                item.receipt +
                                "' data-lc='" +
                                item +
                                "' data-links='" +
                                item.bolLinks +
                                "' data-status='" +
                                item.status +
                                "' data-refnum='" +
                                item.ref_num +
                                "'>" +
                                //convertToDisplay(operation, " ") +
                                "</button>";*/

                            //Button triggers modifyLc page or submitBol page, do not store any data, redirection purpose only
                            /*if (operation === "modify lc" || operation === "submit bol") {
                                item =
                                    "<button type='button'  data-refnum=" +
                                    item.ref_num +
                                    " class='btn btn-primary homeButton' id='" +
                                    url +
                                    "'>" +
                                    convertToDisplay(operation, " ") +
                                    "</button>";
                            }*/
                            item.ref_num = '<a href="modal.html?refNum=' + item.ref_num + '" data-toggle="ajaxModal"><i class="fa fa-pencil"></i></a>';
                        });
                    }
                })
            });
        });

    });
}(window.jQuery);