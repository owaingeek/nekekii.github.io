var moviename = "Bob Ross - One Hour Special - The Grandeur of Summer"; //Name of Video
var movieid = "mT0RNrTDHkI"; //Video ID
var moviestart = 1575735300000; //UTC Start Time
var movieend = 1575738900000; //UTC End Time
var service = "youtube"  //Currently compatible: drive, youtube
var tid;
var currentdate;
var stage = 0;
var counter = 0;
var watching = false;
var stale = 0;
var maxstale = 7;

function checkLoop() {
  //console.log("looooop");
  currentdate = new Date();
  if (movieend < moviestart) {
    alert("Error configuring timing")
  } else if (movieend <  currentdate.getTime()) {
    endText();
  } else if (moviestart > currentdate.getTime()) {
    earlyText();
  } else if ( (moviestart < currentdate.getTime()) && (movieend >  currentdate.getTime()) ) {
    runningText();
  } else {
    alert("Error with detecting stage");
  }
}

function endText() {
  $( "#toclick" ).html( "<h3><p>Hewwo my name is Icy and welcome to my website!</p><p>This website uses cookies from Google to work.</p><span id=\"starttext\"></span></h3>" )
  $( "#toclick" ).css( "z-index", "2" )
  $( "#starttext" ).html( "<p><span class=\"rainbow\">Thank you for stopping by! The movie has ended at this time. Please come back again later!<span> 💜</p>" );
  stage = 3;
  clearInterval(tid);
}

function earlyText() {
  currentdate = new Date();
  var moviestartdate = new Date(moviestart);
  var timeleft = Math.floor((moviestart - currentdate.getTime()) / 1000);
  if (stage !== 1) {
    $( "#starttext" ).html( "<p>You're heckin\' early! The movie will start in <span id=\"countodwn\" class=\"rainbow\"></span> seconds! That's at " + moviestartdate.toString() + ".</p>");
    stage = 1;
  }
  if(timeleft.toString() == 3) {
    refreshVideo();
  }
  //console.log(timeleft);
  $( "#countodwn" ).html(timeleft.toString());
}

function runningText() {
  if(service == "drive") {
    if (stage !== 2) {
      refreshVideo();
      $( "#starttext" ).html( "<p>To start watching and sync the movie with everyone else, <h2><span class=\"rainbow\">double click</span></h2> in the center of the page.</p>" );
      stage = 2;
    } else if(watching == false) {
      if(counter > 2) {
        counter = 0;
        if(stale <= maxstale) {
          refreshVideo();
          stale ++;
        } else {
          //console.log("video refresh refused - client stale")
        }
      } else {
        counter ++;
        //console.log("Counter: " + counter);
      }
    }
  } else if(service == "youtube") {
    if(watching == false) {
      $( "#starttext" ).html( "<p><h2><span class=\"rainbow\">Loading...</span></h2> Been loading a while? Try and make sure Javascript is enabled and refresh.</p>" );
      refreshVideo();
      stage = 2;
      watching = true;
      $( "#toclick" ).html( "" ).css( "z-index", "-1");
    }
  } else {
    alert("Error configuring service!");
  }

}

function refreshVideo() {
  currentdate = new Date();
  var timeinto = Math.floor((currentdate.getTime() - moviestart) / 1000);
  //console.log("Updating -- Time Into Movie " + timeinto.toString());
  if(service == "drive") {
    $( "#videoframe" ).html( "<div id=\"videoframe\"><iframe src=\"https://drive.google.com/file/d/" + movieid + "/preview?t=" + timeinto.toString() + "\"></iframe>" )
  } else if(service == "youtube") {
    $( "#videoframe" ).html( "<div id=\"videoframe\"><iframe src=\"https://youtube.com/embed/" + movieid + "?autoplay=true&start=" + timeinto.toString() + "\"></iframe>" )
  }
}


$(document).ready(function(){

  console.log("Hiiii my name is Icyyyy and you're looking at my consoleeee");
  tid = setInterval(checkLoop, 1000);
  $( "#moviename" ).html( "<span class=\"rainbow\">" + moviename + "</span>");


  $( "#toclick" ).click(function() {
    if(service == "drive") {
      if (stage == 2) {
        if(stale >= maxstale) {
          console.log("refreshing video cause stale");
          refreshVideo();
        }
        watching = true;
        $( "#toclick" ).html( "" ).css( "z-index", "-1");
      }
    }
  });
});
