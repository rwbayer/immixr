jQuery(function($) {
	"use strict";

	$.validate();

	//Variables
	var fixed_point = 0;
	var loaded = false;

	
	$(window).load(function(){
		loaded = true;
		Adjust();
		var url = window.location.href;
		console.log(url); 
		var accessToken = url.substring(54,100);
		console.log(accessToken);
		
	});

	$(window).resize(function(){
		Adjust();
	});


	

	function Adjust(){
		if($(window).width() > 768)
		{
			$('header').height($(window).height());
			$('.intro-book').css('top', ($('header').height() / 2 - $('.intro-book').height() / 2) + "px");
			$('.intro-text').css('top', ($('header').height() / 2 - $('.intro-text').height() / 2) + "px");
			
		}
		else {
			$('header').height(400);
		}
		
	

		$(document).ready(function() {
			var userID = "1520190960";
			var accessToken = "1520190960.b5eb537.43e42d9b4992467fb9bba147394d1163";
			var biggestWidth = 213;

			immixr(8, .1, userID, accessToken, biggestWidth);
			immixr2(0, 1, userID, accessToken, 100);

			$('.notification-box').addClass('active');

		});
	}

// FROM: http://stackoverflow.com/questions/19491336/get-url-parameter-jquery
// $.urlParam = function(name){
//     var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
//     if (results==null){
//        return null;
//     }
//     else{
//        return results[1] || 0;
//     }
// }
	


	
});