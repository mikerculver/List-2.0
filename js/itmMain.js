$(document).ready(function(){
  $("#addBox").prop('disabled', false);
	
  //Get the records
  getCat();

  //Set the edit flag to zero
	edtFlag = 0

	//Put the cursor in the first input box
	$("#addBox").focus();

	//Toggle edit controls, disable links, and set edit flag
	$("#edtButton").click(function() {     
   	  $('.edit_ctrls').fadeToggle();
	  $("#edtButton").toggleClass("btn-danger")   	  
   	  $("#addBox").prop('disabled', true);
      if (edtFlag == 0) {
	    edtFlag = 1;
	    $('.list-group-item').attr('href',function(i,v) {
        	return "#" + v;
        });
      } else if (edtFlag ==1) {
		edtFlag = 0;
		$("#addBox").prop('disabled', false);
		$('.list-group-item').attr("href", function(i, o) {
            return o.replace("#", "");
        });
        $("#addBox").focus();
      }
	});

  //Get a list of all groups
  function getCat(){
    var queryString = window.location.search;

    var grpID = queryString.split("=");

    $('#lstMem').attr('value', grpID[1]);
    $('#listHeader').text(decodeURI(grpID[2]));

    queryString = "app/itmSelectItem.php" + queryString;   

    $.ajax({
     type: "GET",
     url: queryString,     
     //url: "app/lstSelectList.php",
     async: false,
     beforeSend: function(x) {
      if(x && x.overrideMimeType) {
       x.overrideMimeType("application/j-son;charset=UTF-8");
     }
   },
   dataType: "json",
   success: function(data){
     var items="";
     $.each(data,function(index,item){
      /*if (item.color == 0) {
        cColor = 'white_card';
        } else {
        cColor = 'black_card';
      }*/
        cColor = 'null'
       //Return a bootstrap formated list group
       items+="<a href='#' class='list-group-item list-item-border' id='lstid"+item.item_id+"'> "+item.name+" <span class='pull-right edit_ctrls rname_margin'><button class='btn btn-xs btn-info' data-toggle='modal' data-target='#basicModal' data-listid='"+item.item_id+"'>Rename</button> <button class='btn btn-xs btn-warning' id='deletelist' data-listid='"+item.item_id+"'><span class='glyphicon glyphicon-trash'></span></button></span><span class='pull-right "+ cColor +"'> </span></a>";
     });
     $("#content").html(items);
   },
   error: function(){
    alert("failure");
   }
    });
  };          

  //Create List Group
    $('body').keypress(function(e){
    
     

    if (e.keyCode == 13 && !e.shiftKey && $("#addBox").is(':focus')) {

    var checkEmpty = $('#addBox').val();
    if(checkEmpty < 1){ 
    return false; 
    }  
      
    if (edtFlag != 1)
     $.ajax({
       type: "POST",
       url: "app/itmCreateItem.php",
       data: $('form.contact').serialize(),
       dataType: "json",
       success: function(data){
       var list="";
	       //Return a bootstrap formated list group
      /*if (data.color == 0) {
        cColor2 = 'white_card';
        } else {
        cColor2 = 'black_card';
      }*/
      cColor2 = 'null'
	       list="<a href='#' class='list-group-item list-item-border' id='lstid"+data.item_id+"'> "+ data.name +" <span class='pull-right edit_ctrls rname_margin'><button class='btn btn-xs btn-info' data-toggle='modal' data-target='#basicModal' data-listid='"+ data.item_id +"'>Rename</button> <button class='btn btn-xs btn-warning' id='deletelist' data-listid='"+ data.item_id +"'><span class='glyphicon glyphicon-trash'></span></button></span><span class='pull-right "+ cColor2 +"'> </span></a>";
       				  $('#content').hide().prepend(list).slideDown();	
                      $('#subGrp')[0].reset();
                    },
       error: function(){
                      alert("failure");
                    }
                  });
    }
   });

  //Set id value on hidden input on modal
  $(document).on('click', '.btn-warning', function() {
    $('#basicModal2').modal('show');
    $("#dellstID").attr("value",$(this).data('listid'));
    delcid =   $(this).data('listid');
    $("#lstName").text($(this).closest(".list-group-item").text().split("Rename",1))
  });

    //Set input field focus when rename modal is opened
    $('#basicModal2').on('shown.bs.modal', function () {
   		$('#delete').focus();
	})

  //Delete list Group
    $(document).on('click', '#delete', function() { 	
  	$.ajax({
     type: "POST",
     url: "app/itmDeleteItem.php",
     data: $('form.delete').serialize(),
     success: function(){
                    $("#lstid"+delcid).slideUp('slow', function() {$(this).remove();});
                  },
                  error: function(){
                    alert("failure");
                  }
    });
    $('#basicModal2').modal('hide');
    });

    //Set form id for list to rename, Set input box value to text
    $(document).on('click', '.btn-info', function() {    
        $("#lstID").attr("value",$(this).data('listid'));  
        $("#renameBox").val($(this).closest(".list-group-item").text().split("Rename",1));
    });

    //Set input field focus when rename modal is opened
    $('#basicModal').on('shown.bs.modal', function () {
   		$('#renameBox').focus();
	  })
    
    //Update list name
    $(document).on('keypress', function(e) {    
    if (e.keyCode == 13 && !e.shiftKey && $("#renameBox").is(':focus')) {

    var checkEmpty = $('#renameBox').val();
    if(checkEmpty < 1){ 
    return false; 
    }

	    $.ajax({
	        type: "POST",
	        url: "app/itmUpdateItem.php",
	        data: $('form.rename').serialize(),
	        dataType: "json",
	        success: function(data){
	                    $('#renameList')[0].reset();
	                    //Flip the edit controls off for the update
        	            $('.edit_ctrls').toggle();
        	            //Upate the list name

                      /*if (data.color == 0) {
                        cColor3 = 'white_card';
                        } else {
                        cColor3 = 'black_card';
                      }*/
                      cColor3 = 'null'

	                    $('a#lstid'+data.item_id).html(data.name +" <span class='pull-right edit_ctrls rname_margin'><button class='btn btn-xs btn-info' data-toggle='modal' data-target='#basicModal' data-listid='"+ data.item_id +"'>Rename</button> <button class='btn btn-xs btn-warning' id='deletelist' data-listid='"+ data.item_id +"'><span class='glyphicon glyphicon-trash'></span></button></span><span class='pull-right "+ cColor3 +"'> </span>");
	                    //Flip the edit controls back on
	                    $('.edit_ctrls').toggle();
	                    },
	                    error: function(){
	                      alert("failure");
	                    }
	                  });
	    $('#basicModal').modal('hide');
	}
    });

    //Roate text on footer
    var texty = new Array("Built-In Ice Scraper&#8482;", "As seen on TV!", "Sugar Free&#8482;", "Big Pointy Teeth&#8482;", "Buckets of lava&#8482;", "Fat free!", "Full of Stars&#8482;", "End of Line.", "May contain nuts...", "Now in 3D&#8482;", "Stay a while and listen?", "That's no moon!", "Water proof&#8482;", "Make it so&#8482;", "You can't explain that!", "The Bird is the word&#8482;"),
    randno = texty[Math.floor( Math.random() * texty.length )];
    $('.quote').html( randno );
});