(function($) {
  "use strict"; // Start of use strict

  // Floating label headings for the contact form
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });

  // Show the navbar when the page is scrolled up
  var MQL = 992;

  //primary navigation slide-in effect
  if ($(window).width() > MQL) {
    var headerHeight = $('#mainNav').height();
    $(window).on('scroll', {
        previousTop: 0
      },
      function() {
        var currentTop = $(window).scrollTop();
        //check if user is scrolling up
        if (currentTop < this.previousTop) {
          //if scrolling up...
          if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
            $('#mainNav').addClass('is-visible');
          } else {
            $('#mainNav').removeClass('is-visible is-fixed');
          }
        } else if (currentTop > this.previousTop) {
          //if scrolling down...
          $('#mainNav').removeClass('is-visible');
          if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
        }
        this.previousTop = currentTop;
      });
  }

  if(window.indexedDB){
    console.log('init indexdb');
    var db = null;
		var contador = 0;
    var objBanco = window.indexedDB.open("blog", 1);

    objBanco.onsuccess = function(evento) {
			console.log("Conexão realizada com sucesso!");
			db = evento.target.result;
			
			//CONSULTA
			var tx = db.transaction(["posts"], "readonly");
			var despesaStore = tx.objectStore("posts");
			
      var request = despesaStore.openCursor();
      request.onerror = function(evento){
				console.log("Erro na consulta");
      }
      
      request.onsuccess = function(evento){
        var cursor = evento.target.result;
				if(cursor){
          console.log('results');
        } else {
          console.log('not results');
        }
      }

    }
  }

})(jQuery); // End of use strict
