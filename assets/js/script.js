$(document).ready(()=>{
  $(".navbar-toggle-icon").click(()=>{
    $(".navebar ul").css("width","100%");
  });
  $(".navebar ul li").click(()=>{
    if($("body").width() < 768){
      $(".navebar ul").css("width","0%");
    }
  });
  
  let hp = $('.slider-show').height() - 60;
  $(window).scroll(function() {
    if ($(this).scrollTop() > hp ) { 
      $('.index .navebar').css('background-image','linear-gradient(109.6deg, rgb(154,183,248) 11.2%, rgba(110,123,251,1) 91.1% )');
      $('.index .navebar ul a').css('color','white');
      $('.to-top').fadeIn();
    } else {
      $('.index .navebar').css("background","none");
      $('.index .navebar ul a').css('color','rgb(110,123,251)');
      $('.to-top').fadeOut();
    }
  });
  
  $("#send_msg").click(function(event) {
    if ( $("#name").val() !== "" && $("#msg").val() !== "" ) {
     event.preventDefault();
     window.location.href = `https://wa.me/+201018646196?text= انا : *${$("#name").val()}* ${$("#msg").val()}`;
    }
  });
  
  $("#searchInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#table-id tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
/*
|======================================
|
|      Programming  : Adel Mahmoud
|      Phone Number : +201018646196
|   
|======================================
*/