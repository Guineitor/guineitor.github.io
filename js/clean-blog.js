if(window.indexedDB) {
  var db = null;
  var objBanco = window.indexedDB.open("blog", 1);
  objBanco.onsuccess = function(evento){
    console.log("Conexão realizada com sucesso!");
    db = evento.target.result;

     //CONSULTA
     var tx = db.transaction(["posts"], "readwrite");
     var posts = tx.objectStore("posts");
     
     var request = posts.openCursor();
     request.onerror = function(evento){
         console.log("Erro na consulta");
     }
     
     //Caso a requisição deu certo!
     request.onsuccess = function(evento){

         var cursor = evento.target.result;
         if(cursor){
             
             var post = cursor.value;

             var html  = '<div class="post-preview">'
             +'<a href="index.html?post='+post.codigo+'">'
             +'  <h2 class="post-title">'
             +post.title
             +'</h2>'
             +' <h3 class="post-subtitle">'
             +post.subtitle
             +' </h3>'
             +'</a>'
             +'<p class="post-meta">Posted by'
             +'  <a href="#">'+post.postedBy+'</a>'
             +'  on '+post.postedAt+'</p>'
             +'<img src="img/reddumpster.jpg" width="30" height="30" class="lixeira" value="'+post.codigo+'" />'
             +'</div>'
             +' <hr>'

            $(".feeds").append(html);
            //postList.push(post);

            cursor.continue();
         }   
     }
  }

  $("#deletar").click(function(){
    alert(this);
 });
  
  objBanco.onerror = function(evento){
    console.log("Erro na conexão com banco de dados", evento);
  }
  
  objBanco.onupgradeneeded = function(evento){
    db = evento.target.result;
    var obj = db.createObjectStore("posts", 
    { keyPath: "codigo", autoIncrement: true });
      } 
} else {
  console.log("Banco de dados IndexedDB não suportado");
}

$( document ).ready(function() {
  
  var postId = getPostId(window.location.search);
  var postList = [];
  console.log(postId);

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

  

    $("#novo-post").click(function(){
      $(".feed").hide();
      $(".post").hide();
      $(".postar").show();
    });

    $("#salvar-post").click(function(){
        
      var title = $("#title").val();
      var subtitle = $("#subtitle").val();
      var text = $("#text").val();
      var postedAt = new moment().format('MMMM Do YYYY, h:mm:ss a');
      var postedBy = getCookieUserNameGoogle();

      //JSON
      var post = {
          title: title,
          subtitle: subtitle,
          text: text,
          postedAt: postedAt,
          postedBy: postedBy    
      };
      console.log(post);
      
      var tx = db.transaction(["posts"], "readwrite");
      var postsStore = tx.objectStore("posts");
      postsStore.put(post);
            
      window.location = "index.html";      
    });

    if ($.isNumeric(postId)){
      $(".feed").hide();
      $(".post").show();
      $(".postar").hide();

      $(".spansubheading").hide();
      $(".meta").show();
      var tx = db.transaction(["posts"], "readwrite");
      var postsStore = tx.objectStore("posts");
      var objConsulta = postsStore.get(parseInt(postId));
      objConsulta.onsuccess = function() {
        var registro = objConsulta.result;
        console.log(registro);
        $("#header-subtitle").show();
        $("#header-title").html(registro.title);
        $("#header-subtitle").html(registro.subtitle);
        $("#postedBy").html(registro.postedBy);
        $("#postedAt").html(registro.postedAt);
        $("#article").html(registro.text);
 
      }
      
      // img/redpandalookingdown.jpg'
    

    } else {
      $(".spansubheading").show();
      $(".meta").hide();
      $("#header-subtitle").hide();
      $(".feed").show();
      $(".post").hide();
      $(".postar").hide();
      $(".lixeira").click(function(){
          var codigo = parseInt($(this).attr("value"));
          console.log(codigo);
          //console.log(codigo);
          var tx = db.transaction(["posts"], "readwrite");
          var postsStore = tx.objectStore("posts");

          var r= prompt("digite 'sim' para excluir o post? ")
          if(r === "sim") {
            postsStore.delete(codigo);
            location.reload();
          }

      });
    }
      

  function getPostId(value) {
    return value.split("=")[1];
  }
      
  function getCookieUserNameGoogle() {
    return "Você";
}

  console.log( "ready!" );
});