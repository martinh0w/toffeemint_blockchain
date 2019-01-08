function pageLoad() {
    $(document).ready(function(e) {

        //var getUserItem = sessionStorage.getItem('user');
        //var user = $.parseJSON(getUserItem);
        //var usertype = user.usertype;
        if (sessionStorage.usertype === "importer" || sessionStorage.usertype === "exporter") {
            var getPageItem = sessionStorage.getItem('page');
            if (getPageItem !== null) {
                var newPageJSON = $.parseJSON(getPageItem);
                //var refNum = newPageJSON.refNum;
                var newPage = newPageJSON.page;
                if (newPage === "homeTemplate" || newPage === "viewLcLogTemplate") {
                    newPage = "../" + newPage;
                }
                //console.log(newPage);
                //empty content
                $('#content').load(newPage + ".html");
                sessionStorage.removeItem('page');
            } else {
                $('#content').empty();
                // document.location.reload(true);
                $('#content').load('../homeTemplate.html');
                //e.defaultPrevented(); 
            }


            $('.pages').click(function() {
                $('#content').empty();
                var page = $(this).attr('href');
                //var page = this.id;
                if (page === "homeTemplate" || page === "viewLcLogTemplate") {
                    page = "../" + page;
                }
                //console.log(page);
                $('#content').empty();
                $('#content').load(page + ".html");
                return false;
            });

        } else if (sessionStorage.usertype === "shipper") {
            var getPageItem = sessionStorage.getItem('page');
            if (getPageItem !== null) {
                var newPageJSON = $.parseJSON(getPageItem);
                //var refNum = newPageJSON.refNum;
                var newPage = newPageJSON.page;

                //console.log(newPage);
                //empty content
                $('#content').load(newPage + ".html");
                sessionStorage.removeItem('page');
            } else {
                $('#content').empty();
                $('#content').load('home.html');
                //e.defaultPrevented(); 
            }

            $('.pages').click(function() {
                $('#content').empty();
                var page = $(this).attr('href');
                //var page = this.id;
                //console.log(page);
                $('#content').empty();
                $('#content').load(page + ".html");
                return false;
            });

        }

    });
}