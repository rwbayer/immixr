jQuery(function($) {
	"use strict";

	$.validate();

	new WOW().init();
	//Variables
	var fixed_point = 0;
	var loaded = false;
	var windowWidth = $(window).width();

	// Author Code Here
	$(window).load(function(){
		$('.owl-book').owlCarousel({
			singleItem:true,
			items:1,
			pagination:false,
			autoPlay:3000
		});
		$('.owl-reviews').owlCarousel({
			items:3,
			navigation:true,
			autoPlay:5000,
			navigationText: ["<i class='arrow_carrot-left'></i>","<i class='arrow_carrot-right'></i>"]
		});
		$('.main-nav').onePageNav({
			currentClass: 'active',
			changeHash: false,
			scrollSpeed: 400
		});
		$(".get-direction").tooltip({
		    direction: "top"
		});
		// Navbar "Breaking" Fix
		loaded = true;
		Adjust();
		$('.navbar').after("<div class='navbar-filler'></div>");
	});

	$(window).resize(function(){
		Adjust();
	});


	$(window).scroll(function(){

		//Following Navbar
		if($(window).scrollTop() > fixed_point && loaded)
		{
			$('.navbar').addClass('nav-fixed');
			$('.navbar-filler').height($('.navbar').outerHeight(true));
		}
		else
		{
			$('.navbar').removeClass('nav-fixed');
			$('.navbar-filler').height(0);
		}
	});

	function Adjust(){
	// iOS resizing fix from: http://stackoverflow.com/questions/8898412/iphone-ipad-triggering-unexpected-resize-events
     
        // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
        if ($(window).width() != windowWidth) {

            // Update the window width for next time
            windowWidth = $(window).width();

            // Do stuff here
			if($(window).width() > 768)
			{
				$('header').height($(window).height());
				$('.intro-book').css('top', ($('header').height() / 2 - $('.intro-book').height() / 2) + "px");
				$('.intro-text').css('top', ($('header').height() / 2 - $('.intro-text').height() / 2) + "px");
				
			}
			else {
				$('header').height(400);
			}
			if(!$('.navbar').hasClass("nav-fixed") && loaded)
				fixed_point = $('.navbar').offset().top;

			$(document).ready(function() {
				var userID = "1520190960";
				var accessToken = "1520190960.b5eb537.43e42d9b4992467fb9bba147394d1163";
				var biggestWidth = 213;

				immixr(8, .1, userID, accessToken, biggestWidth);
				immixr2(0, 1, userID, accessToken, 100);
				immixr3(5, .2, userID, accessToken, 145);

			});
		}
	}

	 
	
	$('.sample-button').click(function(event){
		$('#sample-form').slideDown();
		event.preventDefault();
	});

	$('form').submit(function(event){
		if($(this).find(".has-error").length > 0)
			return;
		event.preventDefault();
		var that = $(this),
			url = $(that).attr('action'),
			type = $(that).attr('method'),
			dataX = {};
			
		$(that).find("[name]").each(function(){
			dataX[$(this).attr("name")] = $(this).val();
		});

		$('.notification-box').addClass('active');

		$.ajax({
			type:'POST',
			url: url,
			data: dataX,
			success: function(response){
				$('.notification-box span').html(response);
					setTimeout(function(){
						$('.notification-box').removeClass('active');
						$('.notification-box span').html("Sending...");
					}, 4000);
				}
		});
	});

	// Mobile Nav
	$('.mobile-nav > ul').html($('.navbar-nav').html());
	$('.mobile-nav').append("<a href='#' class='close-btn'><i class='icon_close'></i></a>");

	$('.navbar-toggle').click(function(event){
		event.stopPropagation();
		$('#wrapper').addClass('behind');
		$('.mobile-nav').addClass('active');
	});
	$('.mobile-nav a.close-btn').click(function(event){
		$('#wrapper').removeClass('behind');
		$('.mobile-nav').removeClass('active');
		event.preventDefault();
	});

	// Scrolling
	$('a.scrollto').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $("[name='" + this.hash.slice(1) +"']");
			if (target.length) {
				$('#wrapper').removeClass('behind');
				$('.mobile-nav').removeClass('active');
				$('html,body').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});
});