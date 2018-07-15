Imgur Album Downloader
======================

A Pure JS webapp to download entire or parts of Imgur albums.

A modified clone of this: http://dschep.github.io/imgur-album-downloader now hosted here: https://fluffy9.github.io/imgur-album-downloader/

Note: Large albums or albums containing very high resolution photos
might not work, depending on how much RAM your system has. You can
download whole albums natively on Imgur by appending `/zip` to the URL.

This is modified to work embedded on your website. It automatically downloads an album when the album id is provided and downloads it to the user's computer. You can embed the link to the album in your website as a hidden iframe. If you want to add a loading bar, the child iframe posts a message to the parent window in the form of "{{ Currently Downloaded Pages }}/{{ Total Pages }}"

# Live Example

[JsFiddle](http://jsfiddle.net/pseovftL/8/)

# How to Use

You will need JQuery and Bootstrap for this tutorial

## Change the Client ID

Fork this code and open controller.js. Please change the client id to your own. You will need an imgur account but they are free. You can get one [here](https://api.imgur.com/oauth2/addclient).

```
// Use CORS
    $http.defaults.useXDomain = true;
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.get(
        'https://api.imgur.com/3/album/' + $scope.albumid, //i46pk',
        // client ids can't really be secured in javascript.
        // don't be a dick, get your own, they're free.
        { headers: { Authorization: 'Client-ID 9a87b414599044c' } }
    ).success(function (data) {
        $scope.album = data.data;
        $scope.album.images.forEach(function (image) {
            image.selected = true;
        });
        $scope.preserveFileOrder = true;
        $scope.to_download = $scope.album.images;
        $scope.download();
    });
```

## Create the Iframe:

Download button sample html

```
<a id="download" class="source" style="color: var(--color3)" href="#"><span>[Source 1]</span></a>

``` 

iframe javascript

```
	$( document ).ready(function() {
		
		//When the download button is clicked
		$("#download").click(function(){
			//Hide the download button so the user cannot click it multiple times
			$("#download").hide();
			//Show the download progress bar
			$("#download_bar").show();
			//Create the iframe. Replace {{ imgurid }} with your imgur album id
			var iframe = $("<iframe />",{ src: "https://fluffy9.github.io/imgur-album-downloader/#/{{ imgurid }}", style: "width:100%; display:none"}).appendTo("body");
			iframe.ready(function(){
				
			});
		});
	});

```

## Adding a bootstrap progress bar:

Sample HTML

```
<div style="padding-top:5px;">
					<div id="download_bar" style="display:none; width:100px" class="progress">
					  <div class="progress-bar" role="progressbar" aria-valuenow="0"
					  aria-valuemin="0" aria-valuemax="100" style="width:0%">
						<span class="sr-only">0% Complete</span>
					  </div>
					</div>
					</div>
```

Listen to the messages that the iframe is sending and update the progress bar accordingly

```
window.addEventListener('message',function(e) {
		var key = e.message ? 'message' : 'data';
		// The data as an array. Data[0] is the currently downloaded image. Data[1] is the total number of images to be downloaded. 
		var data = e[key].split("/");
		//Turn this into a percentage
		percent = (data[0]/data[1])*100;
		//Change the percentage of the progress bar
		$($(".progress-bar")[0]).attr("aria-valuenow", percent);
		$($(".progress-bar")[0]).attr("style", "width:" + percent + "px");
		$($(".sr-only")[0]).text(percent);
	},false);
```	

