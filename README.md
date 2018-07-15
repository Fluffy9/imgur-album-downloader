Imgur Album Downlaoder
======================

A Pure JS webapp to download entire or parts of Imgur albums.

A modified clone of this: http://dschep.github.io/imgur-album-downloader now hosted here: https://fluffy9.github.io/imgur-album-downloader/

Note: Large albums or albums containing very high resolution photos
might not work, depending on how much RAM your system has. You can
download whole albums natively on Imgur by appending `/zip` to the URL.

This is modified to work embedded on your website. It automatically downloads an album when the album id is provided and downloads it to the user's computer. You can embed the link to the album in your website as a hidden iframe. If you want to add a loading bar, the child iframe posts a message to the parent window in the form of "{{ Currently Downloaded Pages }}/{{ Total Pages }}"

Sample HTMl 

window.addEventListener('message',function(e) {
		var key = e.message ? 'message' : 'data';
		var data = e[key].split("/");
		percent = (data[0]/data[1])*100;
		$($(".progress-bar")[0]).attr("aria-valuenow", percent);
		$($(".progress-bar")[0]).attr("style", "width:" + percent + "px");
		$($(".sr-only")[0]).text(percent);
		//run function//
	},false);
	$( document ).ready(function() {
		
		$("#download").click(function(){
			$(".source").hide();
			$("#download_bar").show();
			var iframe = $("<iframe />",{ src: "https://fluffy9.github.io/imgur-album-downloader/{{ $imgurid }}", style: "width:100%; display:none"}).appendTo("body");
			iframe.ready(function(){
				
			});
		});
	});
