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
		var accessToken = url.substring(54,105);
		console.log(accessToken);
		
		// Once you have the access Token, use a self call to get user id. store both, then use the stackoverflow article 
		// to create a new file with these variables inside and offer to user for download on auth page.


		// get instagram feed
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          //change the url when you have internet
          url: 'https://api.instagram.com/v1/users/' + userID + '/media/recent/?access_token=' + accessToken + '&count=33',
          success: function(instagram_data) {
            var instagramFeed = instagram_data.data;
            //after you have all the variables necessary, create new script and offer to user for download
            createNewScript(gutterWidth, opacity, userID, accessToken, biggestWidth);
            
          },
          async: true
        });
		
	});

	$(window).resize(function(){
		Adjust();
	});

	function createNewScript(gutterWidth, opacity, userID, accessToken, biggestWidth) {

		// apend this to normal immixr script
		var scriptText ='$(document).ready(function() {
			var userID = "' + userID +'";
			var accessToken = "' + accessToken + '";
			var biggestWidth = ' + biggestWidth +';
			var opacity = ' + opacity +';
			var gutterWidth = ' + gutterWidth +';

			immixr(gutterWidth, opacity, userID, accessToken, biggestWidth);

		});' + 

		// immixr script
		'function immixr(gutterWidth, opacity, userID, accessToken, biggestWidth) {
    $(document).ready(function() {
      //initiate feed variable
      var instagramFeed;

      // if window is resized, reload the page to fix layout
      $(window).resize(function(){location.reload();});

      // get instagram feed
        $.ajax({
          type: "GET",
          dataType: "jsonp",
          url: \'https://api.instagram.com/v1/users/\' + userID + \'/media/recent/?access_token=\' + accessToken + \'&count=33\',
          success: function(instagram_data) {
            var instagramFeed = instagram_data.data;
            // draw images into parent div
            draw(instagramFeed, gutterWidth, biggestWidth);
            // set the opacity to user-specified amount
            $(\'img.immixr\').css("opacity", opacity);
            
          },
          async: true
        });
    });
}
      

function draw(instagramFeed, gutterWidth, biggestWidth) {

/* Set Up Variables for Drawing */

  // get drawable location from parent
  var elementWidth = $("div#immixr").parent().width();
  var elementHeight = $("div#immixr").parent().height();

  // the width between each image (above, below, left & right)
  var segmentWidth = gutterWidth;

  // variables to control image display size, based off of the biggest size passed by user (decided to only go with 2 different sizes for this one)
  var bigWidth = biggestWidth;
  var smallWidth = (bigWidth - segmentWidth) / 2;
  
  // cursor is the variable that traverses the instagram feed array
  var cursor = 0; 
  // keep track of whether last row is big or small
  var lastRowisSmall = 0;   

  // this is the length of the instagram feed array. should usually be 33 (instagram max for a singular call)
  var igLength = instagramFeed.length;           
  
  // the amount of available space left (changes as row increments)
  var availableWidth = (elementWidth - segmentWidth);
  var availableHeight = (elementHeight - segmentWidth);

  // the position where the next drawing should be placed
  var left = segmentWidth;
  var top = segmentWidth;

  // keep track of row number and height of all images in div
  var row = 1;
  var dataDivHeight = 0;

/* END OF Setting Up Variables for Drawing */

  // set up the first row  
  $(\'div#immixr\').append(\'<div class="immixr-row \'+ (row) + \'"></div>\');
  currentRow = \'div.immixr-row.\' + row;
  if(availableHeight >= bigWidth) {
    dataDivHeight = (bigWidth + segmentWidth);
  }

  // loop while theres space for more rows
  while(availableHeight > smallWidth) {

    // if theres no more room on this row, then move to the next row if possible..
    if(availableWidth < smallWidth) {
      // before moving to the next row, set the width and height of the current row so it can be centered using explicit dimensions
      $(currentRow).css({width: elementWidth - availableWidth, height: (bigWidth + segmentWidth)});
      // reset left to start at one segment width
      left = segmentWidth;
      // adjust available height to take away the width of the previous row
      availableHeight -= (bigWidth + segmentWidth);
      // reset available width to be the whole width
      availableWidth = (elementWidth - segmentWidth);
      // add the new row
      $(\'div#immixr\').append(\'<div class="immixr-row \'+ (++row) + \'"></div>\');
      // increment the row
      currentRow = \'div.immixr-row.\' + row;
      // add the new row to the record of the height of the section (this is for vertical centering)
      if(availableHeight > bigWidth) {
        dataDivHeight += (bigWidth + segmentWidth);
      }
    }
    // if youve reached the end of the instagram feed
    else if(cursor >= igLength) {
      // start over!
      cursor = 0;
    }
    // if theres not enough room for another big row, add a row of the smaller version of images
    else if(availableHeight < (bigWidth + segmentWidth)) {
      // add the small image
      $(currentRow).append(\'<img class="immixr" style="width: \' + smallWidth + \'px; height: auto; position: absolute; top: \' + top + \'px; left: \' + left + \'px;" src="\' + instagramFeed[cursor].images.standard_resolution.url + \'">\');
      // increment the left starting point the appropriate distance    
      left += (smallWidth + segmentWidth);
      // decrement the available width to account for the image we added
      availableWidth -= (smallWidth + segmentWidth);

      // if the new available width is too small to add another image, then this row is over, so adjust the available height
      if(availableWidth < smallWidth) {
        availableHeight -= (smallWidth + segmentWidth);
        dataDivHeight += (smallWidth + segmentWidth);
        $(currentRow).css({width: elementWidth - availableWidth, height: smallWidth + segmentWidth});
        lastRowisSmall = 1;
      }
      // increment the cursor to the next image
      cursor++;
      
    }
    else {
            
      // generate a random number (either 0 or 1) to decide whether you will add small or big image
      var random = Math.floor(Math.random() * 2);
        
      switch(random) {
        
        // if 0, put a big image
        case 0:
          // double check: if theres no room for the image, dont draw it
          if(bigWidth > availableWidth)
            break;
          else {
             $(currentRow).append(\'<img class="immixr" style="width: \' + bigWidth + \'px; height: auto; position: absolute; top: \' + top + \'px; left: \' + left + \'px;" src="\' + instagramFeed[cursor].images.standard_resolution.url + \'">\');
             left += (bigWidth + segmentWidth);
             availableWidth -= (bigWidth + segmentWidth);
             cursor++;
             break;
          }
        // if 1, put two of the small images
        case 1:
          // double check: if theres no room for the images, dont draw it
          if(smallWidth > availableWidth)
            break;
          // special case where cursor wouldnt be able to be incremented, so set manually back to beginning
          else if(cursor == (igLength - 1)) {
            $(currentRow).append(\'<img class="immixr" style="width: \' + smallWidth + \'px; height: auto; position: absolute; top: \' + top + \'px; left: \' + left + \'px;" src="\' + instagramFeed[cursor].images.standard_resolution.url + \'"><img class="immixr" style="width: \' + smallWidth + \'px; height: auto; position: absolute; top: \' + (top + smallWidth + segmentWidth) + \'px; left: \' + left + \'px;" src="\' + instagramFeed[0].images.standard_resolution.url + \'">\');
             left += (smallWidth + segmentWidth);
             availableWidth -= (smallWidth + segmentWidth);
             cursor = 1;
             break;
          }
          else {
             $(currentRow).append(\'<img class="immixr" style="width: \' + smallWidth + \'px; height: auto; position: absolute; top: \' + top + \'px; left: \' + left + \'px;" src="\' + instagramFeed[cursor].images.standard_resolution.url + \'"><img class="immixr" style="width: \' + smallWidth + \'px; height: auto; position: absolute; top: \' + (top + smallWidth + segmentWidth) + \'px; left: \' + left + \'px;" src="\' + instagramFeed[++cursor].images.standard_resolution.url + \'">\');
             left += (smallWidth + segmentWidth);
             availableWidth -= (smallWidth + segmentWidth);
             cursor++;
             break;

          }
          
        default:
          console.log("Something went wrong...");
      }
    }
  }

  if (lastRowisSmall == 0) {
    $(currentRow).css({width: elementWidth - availableWidth, height: bigWidth + segmentWidth});
  }
   
  // add bottom segment with to dataDivHeight
  dataDivHeight += segmentWidth;
  // set the dimensions of the div explicitly to vertically center
  $(\'div#immixr\').css({width: elementWidth, height: dataDivHeight, \'margin-top\': -(dataDivHeight/2)});
}';
      


		// END of IMMIXR script

		// create new script and offer for download

		var textFile = null,
		makeTextFile = function (text) {
			var data = new Blob([text], {type: 'text/plain'});

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
			  window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(data);

			// returns a URL you can use as a href
			return textFile;
		};

		var link = document.getElementById('downloadLink');
		link.href = makeTextFile(scriptText);
	}


	

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

			$('.notification-box').addClass('active');

		});
	}
	
});