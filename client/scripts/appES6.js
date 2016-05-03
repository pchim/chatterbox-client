// YOUR CODE HERE:
var results;
var time;
var rooms = {allRooms: 'allRooms'};
var friendsList = {};
var app = {
  init() {
    $('.username').on('click', () => app.addFriend() );
    //$('#send .submit').on('click', function () { return app.handleSubmit(); });
    $('#send .submit').on('submit', event => {
      app.handleSubmit();
      event.preventDefault();
      $('#message').val('');
    });

    $('select').change(event => {
      //console.log('changed select', $('select').val());
      changeDom($('select').val());
    });
  }, 
  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success(data) {
        console.log('sent: ', data);
      },
      error(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success(data) {
        results = data.results;
        changeDom($('select').val());
      },
      error(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message', data);
      }
    });
  },
  server: 'https://api.parse.com/1/classes/messages',
  clearMessages() {
    $('#chats').children().remove();
  },
  addMessage(message) {
    time = time ? time : 0;
    var username = xssFilters.inHTMLData(message['username']);
    var room = xssFilters.inHTMLData(message['roomname']);
    var text = xssFilters.inHTMLData(message['text']);

    $username = $('<div class=\'username\'>' + username + '</div>');
    $wholeMessage = $('<div class=\'allRooms ' + room + '\'></div>').addClass('chat'); 
    $innerMessage = $('<div class=\'message\'>: ' + text + ' ' + message['createdAt'] + '</div>' );
    $username.on('click', () => {
      if (!friendsList.hasOwnProperty(username)) { 
        friendsList[username] = true;
      }
    });

    if (friendsList.hasOwnProperty(username)) {
      $wholeMessage.addClass('friend');
    }

    $wholeMessage.append($username);
    $wholeMessage.append($innerMessage);
    $('#chats').append($wholeMessage);
    if (!rooms.hasOwnProperty(room)) {
      rooms[room] = room;
      $('select').append('<option value=' + room + '>' + room + '</option>');
    }
    
  },
  addRoom(roomName) {
    $('#roomSelect').append('<div>,</div>');
  },
  addFriend(friendName) {

  },
  handleSubmit() {
    var message = {
      username: window.decodeURIComponent(window.location.search.substr(10)),
      text: $('#message').val(),
      roomname: $('select').val()
    };
    app.send(message);
  }
};

var changeDom = room => {
  app.clearMessages();
  _.each(results, item => {
    if (room !== 'allRooms') {
      if (room === xssFilters.inHTMLData(item['roomname'])) {
        app.addMessage(item);
      }
    } else {
      app.addMessage(item);
    }
  });
};

$(document).ready(() => {
  app.init();
  setInterval(() => app.fetch(), 1000);
});
