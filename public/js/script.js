$(document).ready(function()  {
  var offset = 0;
  var templateRecord=$(".templateRecord").html();

//SEARCHING IN THE DATABASE

  $("#find").click(function()  {
    $(".table_poster").empty();
    $(".table_data").empty();
   var title = $("#textbox").val();
  
    $.ajax({
      type:'GET',
      url: "http://localhost:8080/customer?name_like=^" + title + "&_sort=name&_limit=10", 
      success: function(newData){
        if (title == ''){
           window.alert("Please enter the string");
        }
        else{
          if(newData!= ''){
            $.each(newData, function(i, newRecord){
               $('.table_data').append(Mustache.render(templateRecord, newRecord));
            });//End each function    
          }
          else{
            alert("Match not found!!!");
          }
        }//End outer else
      },
      error: function() {
        alert("Error searching data");
      }
    }); // End ajax function
  }); // Click function ends

//LOADING THE WHOLE DATABASE

  $("#load").click(function()  {
    $(".table_poster").empty();
    $(".table_data").empty();

    $.ajax({
      type:'GET',
      url: "http://localhost:8080/customer/?_start=0&_sort=name&_limit=50", 
      success: function(newData){
         window.alert("LOADING successfull");
           $.each(newData, function(i, newRecord){
            $('.table_data').append(Mustache.render(templateRecord, newRecord));
           });//End each function
        },
        error: function() {
          alert("Error loading data");
        }
    }); // End ajax function
  }); // Click function ends

//POSTING TO THE DATABASE

  $('#formBtnSubmit').on('submit', function(){
    var names = $("#inputName").val();
    var gender = $("#inputGender").val();
    var email = $("#inputEmail").val();
    var phone = $("#inputPhone").val();
    var address = $("#inputAddress").val();
    var product_id = $("#inputProductID").val();
    var favoriteLaptop = $("#inputFavoriteLaptop").val();

    var addRecord={
      name: names,
      gender: gender,
      email: email,
      phone: phone,
      address: address,
      Electronics: [
      {
        index: 0,
        product_id: product_id,
        favoriteLaptop: favoriteLaptop
       }
      ]
    };
    $(".table_data").empty();

    $.ajax({
    url: "http://localhost:8080/customer/",
    type: 'POST',
    data: addRecord,
      success: function(newData){
      window.alert("POST successfull");
       $('.table_data').append(Mustache.render(templateRecord, newData));
      }, //End success function
      error: function() {
        alert("Error adding record to the database");
      }
    }); // End ajax function
  });  //submit function ends

//DELETING A RECORD FROM THE DATABASE
  
  $(".table_data").delegate('.delete', 'click', function(){
    var $tr= $(this).closest('tr');

    $.ajax({
     url: "http://localhost:8080/customer/" + $(this).attr('data-id'),
     type: 'DELETE',
      success: function(del){
        $tr.fadeOut(500, function() {
          $(this).remove();
        });
      }//End success function
    });//End ajax function
  });//End Click function

//UPDATE button

    $(".table_data").delegate('.update', 'click', function(){
      var $tr= $(this).closest('tr');
      $tr.find('input.name').val($tr.find('span.name').html());
      $tr.find('input.gender').val($tr.find('span.gender').html());
      $tr.find('input.email').val($tr.find('span.email').html());
      $tr.find('input.phone').val($tr.find('span.phone').html());
      $tr.addClass('edit');
    });//End click function

//CANCEL button

    $(".table_data").delegate('.cancelEdit', 'click', function(){
      $(this).closest('tr').removeClass('edit');
    });//End click function

//SAVING A RECORD

    $(".table_data").delegate('.saveEdit', 'click', function(){
      var $tr= $(this).closest('tr');
      var names= $tr.find('input.name').val();
      var gender= $tr.find('input.gender').val();
      var email= $tr.find('input.email').val();
      var phone= $tr.find('input.phone').val();
      var obj={
        name: names,
        gender: gender,
        email: email,
        phone: phone
      };

      $.ajax({
        url: "http://localhost:8080/customer/" + $tr.attr("data-id"),
        type: 'PUT',
        data: obj,
        success:function(){
          $tr.find('span.name').html(obj.name);
          $tr.find('span.gender').html(obj.gender);
          $tr.find('span.email').html(obj.email);
          $tr.find('span.phone').html(obj.phone);
          $tr.removeClass('edit');
        },
        error: function() {
          alert("Error saving record to the database");
        }        
      });// End ajax function
    });//End click function

//INFINITE SCROLLING

  var start=50;
  $(window).data('ajaxready',true);             
  window.onscroll=yHandler;

  function yHandler(){

    if($(window).data('ajaxready') == false ) return;

    var wrap = document.getElementById('tble');
    var contentHeight = wrap.offsetHeight;
    var yOffset = window.pageYOffset;
    var y = yOffset + window.innerHeight;

    if(y>contentHeight)
    {
      $(window).data('ajaxready',false);
      wrap.innerHTML += '<div class= "newData"></div>';

      $.ajax({
        url: "http://localhost:8080/customer?_start=" + start + "&_sort=name&_limit=10",
        type: 'GET',
        success:function(data)
        {
          start = start + 10;
          var records= JSON.stringify(data);
          $.each(data, function(i, newRecord)
          {
            $('.table_data').append(Mustache.render(templateRecord, newRecord));
          });//End each function 
          $(window).data('ajaxready',true);           
        }//End success function
      });// End ajax function
    }//End IF
  }//End yHandler 
});//ready function ends