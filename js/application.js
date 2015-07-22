$(document).ready(function() {

  //Global variables
  var selectedID = null;
  var userInput
  var eventInput
  var dateInput
  var timeInput
  var notesInput
  var likes
  var dislikes

  //Get object
  var valuesGet = function() {
    var result;
    $.ajax({
      async: false, //Very important
      type: 'GET',
      url: 'http://ga-wdi-api.meteor.com/api/posts',
      dataType: 'JSON',
      success: function(response) {result = response;}
    });
    return result;
  }

  //Filter out what is useful
  var filter = function(input) {
    var output = [];
    for (i = 0; i < input.length; i++) {
      if (input[i].youdonttouchthis == 'true') {
        output.push(input[i]);
      }
    }
    return output;
  }

  //Display object
  var display = function(input) {
    var wantedKeys = ["_id", "user", "event", "date", "time", "notes", "likes", "dislikes"];
    $('#mainTable').append('<tr></tr>');
    for (i=0; i < wantedKeys.length; i++){
      $('#mainTable tr').append('<th>' + wantedKeys[i] + '</th>')
    }
    for (i = 0; i < input.length; i++) {
      $('#mainTable').append('<tr></tr>');
      for (j = 0; j < wantedKeys.length; j++){
        $('#mainTable tr:nth-child('+ (i+2) +')').append('<td></td>')
      }
    }
    for (i=0; i < input.length; i++) {
      for (var key in input[i]) {
        if (wantedKeys.indexOf(key) > -1) {
          $('#mainTable tr:nth-child('+ (i+2) +') td:nth-child(' + (wantedKeys.indexOf(key)+1) +')').text(input[i][key])
        }
      }
    }
  }

  //Get user inputs
  var getUserInputs = function() {
    userInput = $('#userInput').val();
    eventInput = $('#eventInput').val();
    dateInput = $('#dateInput').val();
    timeInput = $('#timeInput').val();
    notesInput = $('#notesInput').val();
  }

  //Reset input forms
  var resetInputForms = function() {
    $('#userInput').val('');
    $('#eventInput').val('');
    $('#dateInput').val('');
    $('#timeInput').val('');
    $('#notesInput').val('');
  }

  //Reload
  var reload = function() {
    input = valuesGet();
    filteredInput = filter(input);
    $('#mainTable').empty();
    display(filteredInput);
  }


  //Submit button
  $("#submitButton").click(function(e){
    e.preventDefault();
    getUserInputs();
    $.ajax({
      type: 'POST',
      data: {
      user: userInput,
      event: eventInput,
      date: dateInput,
      time: timeInput,
      notes: notesInput,
      likes: 0,
      dislikes: 0,
      youdonttouchthis: true,
      dateCreated: new Date()
      },
      url: 'http://ga-wdi-api.meteor.com/api/posts',
      dataType: 'JSON',
      success: function() {reload();}
    });
    resetInputForms();
  });

  //Deselect row
  $(document).on("click","html",function(e) {
    $('tr').css({"background-color":''});
    selectedID = null;
    $('.buttonGp').hide();
    $('.hideWhenSelected').show();
    resetInputForms();
  });

  //Select row + get id
  $(document).on("click","#mainTable tr",function(e) {
    e.stopPropagation() //Very important
    $('tr').css({"background-color":''});
    $(this).css({"background-color":'red'});
    var index = this.rowIndex - 1;
    selectedID = filteredInput[index]._id;
    $('.buttonGp').show();
    $('.hideWhenSelected').hide();
    $('#userInput').val(filteredInput[index].user);
    $('#eventInput').val(filteredInput[index].event);
    $('#dateInput').val(filteredInput[index].date);
    $('#timeInput').val(filteredInput[index].time);
    $('#notesInput').val(filteredInput[index].notes);
    likes = filteredInput[index].likes
    dislikes = filteredInput[index].dislikes
  });

  //Edit button
  $('#editButton').click(function(e){
    e.preventDefault();
    getUserInputs();
    $.ajax({
      type: 'PUT',
      data: {
      user: userInput,
      event: eventInput,
      date: dateInput,
      time: timeInput,
      notes: notesInput,
      youdonttouchthis: true,
      dateCreated: new Date()
      },
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + selectedID + '',
      dataType: 'JSON',
      success: function() {reload();}
    });
    resetInputForms();
  })

  //Delete button
  $('#deleteButton').click(function(e){
    e.preventDefault();
    $.ajax({
      type: 'DELETE',
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + selectedID + '',
      dataType: 'JSON',
      success: function() {reload();}
    });
    resetInputForms();
  })

  //Like button
  $('#likeButton').click(function(e){
    e.preventDefault();
    likes++ ;
    $.ajax({
      type: 'PUT',
      data: {likes: likes},
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + selectedID + '',
      dataType: 'JSON',
      success: function() {reload();}
    });
    resetInputForms();
  })

  //Like button
  $('#dislikeButton').click(function(e){
    e.preventDefault();
    dislikes++ ;
    $.ajax({
      type: 'PUT',
      data: {dislikes: dislikes},
      url: 'http://ga-wdi-api.meteor.com/api/posts/' + selectedID + '',
      dataType: 'JSON',
      success: function() {reload();}
    });
    resetInputForms();
  })


  //Running
  var input = valuesGet();
  var filteredInput = filter(input);
  display(filteredInput);





  $(document).on("click","#addEventForm",function(e) {e.stopPropagation()});
})
