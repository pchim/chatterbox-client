// YOUR CODE HERE:
var results;
var time;
var rooms = {allRooms: 'allRooms'};
var app = {
  init: function () {
    $('.username').on('click', function() {
      app.addFriend();
    });
    //$('#send .submit').on('click', function () { return app.handleSubmit(); });
    $('#send .submit').on('submit', function(event) {
      app.handleSubmit();
      event.preventDefault();
    });

    $('select').change(function(event) {
      console.log('changed select', $('select').val());
      changeDom($('select').val());
    });

  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {

        console.log('sent: ', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log('fetched', data);
        //console.log('chatterbox: Message received', data.results);
        results = data.results;
        changeDom($('select').val());
        //time = Date.now();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },
  server: 'https://api.parse.com/1/classes/messages',
  clearMessages: function() {
    $('#chats').children().remove();
  },
  addMessage: function(message) {
    time = time ? time : 0;
    var username = xssFilters.inHTMLData(message['username']);
    var room = xssFilters.inHTMLData(message['roomname']);
    var text = xssFilters.inHTMLData(message['text']);
    // var messageTime = Date.parse(message['createdAt']);
    // if (messageTime >= time) {
    $username = $('<div class=\'allRooms ' + room + '\'>' 
      + '<div class=\'username\'>' + username + ':' + text + ' ' + message['createdAt'] + '</div></div>' );
    $('#chats').append($username);
    //}
    // time = Date.now();
    if (!rooms.hasOwnProperty(room)) {
      rooms[room] = room;
      $('select').append('<option value=' + room + '>' + room + '</option>');
    }
    
  },
  addRoom: function(roomName) {
    $('#roomSelect').append('<div>,</div>');
  },
  addFriend: function(friendName) {

  },
  handleSubmit: function() {
    var message = {
      username: window.decodeURIComponent(window.location.search.substr(10)),
      text: $('#message').val(),
      roomname: 'testRoom'
    };
    app.send(message);
  }
};

var changeDom = function(room) {
  app.clearMessages();
  _.each(results, function(item) {
    if (room !== 'allRooms') {
      if (room === xssFilters.inHTMLData(item['roomname'])) {
        app.addMessage(item);
      }
    } else {
      app.addMessage(item);
    }
  });
};

$(document).ready(function() {

  app.init();
  //console.log($('#postit'));
  setInterval(function() { app.fetch(); }, 2000);
});
