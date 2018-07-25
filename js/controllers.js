function AlbumCtrl($scope, $routeParams, $http, $location, $window) {
    $scope.album = [];
    $scope.to_download = [];
    $scope.downloaded = 0;
    $scope.progress = 'progress';
    $scope.dl_link = '';
    $scope.albumid = $routeParams.albumid || '';

    $scope.$on('$viewContentLoaded', function (event) {
        $window._gaq.push(['_trackPageview', $location.path()]);
    });

    // Use CORS
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.get(
        'https://api.imgur.com/3/album/' + $scope.albumid, //i46pk',
        // client ids can't really be secured in javascript.
        // don't be a dick, get your own, they're free.
        //{ headers: { Authorization: /*'Client-ID 9a87b414599044c'*/ 'Client-ID 000000000000000' } }
    ).success(function (data) {
        $scope.album = data.data;
        $scope.album.images.forEach(function (image) {
            image.selected = true;
        });
        $scope.preserveFileOrder = true;
        $scope.to_download = $scope.album.images;
        $scope.download();
    }).error(function (data){
        parent.postMessage( "Error: " + data,"*");
    });

    $scope.update = function (albumid) {
        $location.path('/' + $scope.albumid);
    };

    $scope.select_all = function () {
        $scope.album.images.forEach(function (image) {
            image.selected = true;
        });
    };

    $scope.$watch('album', function () {
        if (!$scope.album.images) return;
        $scope.to_download = $scope.album.images.filter(function (val) {
            return val.selected;
        });
    }, function (old_val, new_val) { return true; });

    $scope.download = function () {
        $('#progress-modal').modal({
            keyboard: false,
            backdrop: false
        });
        $scope.downloaded = 0;
        $scope.fileOrderIndex = 0;
        var preserveOrder = $scope.preserveFileOrder; //stop mid download checkbox change from screwing up file order
        var zip = new JSZip();

        $scope.to_download.forEach(function (image) {
            var xhr = new XMLHttpRequest();
            const type = image.type.split('/')[1];
            xhr.open('GET', `https://i.imgur.com/${image.id}.${type}`, true);
            xhr.responseType = 'arraybuffer';
            var filename = (preserveOrder ? $scope.fileOrderIndex + `_` : ``) + `${image.id}.${type}`
            $scope.fileOrderIndex += 1;

            xhr.onreadystatechange = function (e) {
                if (this.readyState == 4 && this.status == 200) {
                    zip.file(filename, this.response);
                    $scope.$apply(function ($scope) {
                        $scope.downloaded += 1;
                        $scope.progress = 'progress';
                        parent.postMessage( $scope.downloaded + "/" + $scope.to_download.length,"*");
                        if ($scope.downloaded == $scope.to_download.length) {
                            $scope.progress = 'progress active striped';
                            var blob = zip.generate({ type: 'blob' });
                            $scope.progress = 'progress';
                            //$scope.dl_link = window.URL.createObjectURL(blob);
                            location.href = window.URL.createObjectURL(blob);
                        }
                    });
                }
            };
            xhr.send();
        });
    };
}

function LandingCtrl($scope, $location, $window) {
    $scope.$on('$viewContentLoaded', function (event) {
        $window._gaq.push(['_trackPageview', $location.path()]);
    });

    $('#bookmarklet')
        .attr('href', 'javascript:' +
        "location.href=location.pathname.replace(/.*\\/a\\//,'" +
        location + "')")
        .bookmarkletHelperArrow({
            color: '#85bf25',
            zindex: 2000,
            pos: 800,
            lw: 4
        });
    
    $scope.update = function (albumid) {
        $location.path('/' + $scope.albumid);
    };
    
    $scope.album.images.forEach(function (image) {
        image.selected = true;
    });
};
