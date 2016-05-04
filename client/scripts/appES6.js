// YOUR CODE HERE:
var results;
var time;
var rooms = {allRooms: 'allRooms', friendRoom: 'friendRoom'};
var friendsList = {};
var currentRoom = 'allRooms';
var stripe = 0;
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
      currentRoom = xssFilters.inHTMLData($('select').val());
      var $tab = $('<li><a href=\'#\' class=\'tabLinks\' onclick=\"currentRoom = \'' + currentRoom + '\'\">' + currentRoom + '</a></li>');
      var $exit = $('<a href =\'#\' class=\'exit\'>x</a>');
      $('ul').find('.selected').removeClass('selected');
      $('ul').append($tab);
      $tab.addClass('selected');
      $tab.append($exit);
      changeDom(currentRoom);
    });

    $('ul').on('click', '.tabLinks', function() { 
      $('ul').find('.selected').removeClass('selected');
      $(this).closest('li').addClass('selected');
    });

    $('ul').on('click', '.exit', function() {
      if ($(this).closest('li').hasClass('selected')) {
        app.clearMessages();
        currentRoom = 'allRooms';
        $('.allRooms').closest('li').addClass('selected');
      }
      $(this).closest('li').remove();
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
        changeDom(currentRoom);
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
    $wholeMessage = $('<div class=\'allRooms ' //room + 
                      + '\'></div>').addClass('chat'); 
    $innerMessage = $('<div class=\'message\'>: ' + text + ' ' + message['createdAt'] + '</div>' );

    if (stripe === 0) {
      $wholeMessage.addClass('stripe1');
      stripe = 1;
    } else if (stripe === 1) {
      $wholeMessage.addClass('stripe2');
      stripe = 0;
    }


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
      $('select').append('<option value=\'' + room + '\'>' + room + '</option>');
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
    if (room === 'friendRoom') {
      if (friendsList[xssFilters.inHTMLData(item['username'])]) {
        app.addMessage(item);
      }
    } else if (room !== 'allRooms') {
      if (room === xssFilters.inHTMLData(item['roomname'])) {
        app.addMessage(item);
      } 
    } else {
      app.addMessage(item);
    }
    
  });
  makeTheme();
};

var makeTheme = function(themeName) {
  var msgColor1 = '#686DB2';
  var msgColor2 = '#E0D01E';
  var topColor1 = '#C81C2D';
  var topColor2 = '#ED1A31';
  var msgColor3 = '#F1B090';
  var msgBG = 'white';
  var bgImage = 'images/ebImage1.jpg';

  $('.stripe1').css('background-color', msgColor1);
  $('.stripe2').css('background-color', msgColor2);
  $('#main').css('background-color', topColor2);
  $('#chats').css('background-color', msgBG);
  $('body').css('background-image', 'url(\'' + bgImage + '\')');

};



$(document).ready(() => {
  app.init();
  setInterval(() => app.fetch(), 1000);
  // app.fetch();

});





