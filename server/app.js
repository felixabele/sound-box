/** Module dependencies. */
require('dotenv').config();

const observe        = require('observe');
const fs             = require('fs');
const cardDatastore  = require('./cardDatastore');

const soundControl = {
  card: null,
};
let mopidyOnline = false;
let webClientConnected = false;
let lastCard = {};
let rfid;
let socket;

const controlObserver = observe(soundControl);

function onAssignList(err, playlistId) {
  if (err === null) {
    cardDatastore.set(soundControl.card.cardId, playlistId);
    controlObserver.set('card', { cardId: soundControl.card.cardId, playlistId: playlistId });
    lastCard.playlistId = '';
  } else {
    console.error(err);
  }
}

controlObserver.on('change', function(change) {
  if ((!webClientConnected) || (socket === null)) { return null; }

  if (change.property[0] === 'card') {
    console.log('controlObserver: changed card to ', soundControl.card.cardId, soundControl.card.playlistId);
    socket.emit('card', soundControl.card);
  }
});

function onIoConnection(ioSocket) {
  socket = ioSocket;
  console.log('client connected');
  webClientConnected = true;

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    socket = null;
    webClientConnected = false;
  });
}

try {
  rfid = require('./rfid');
} catch (err) {
  console.log('RFID not installed, switching to static file');
}

// for local development
if (typeof rfid === 'undefined') {
  fs.watch('./card', {}, (eventType, filename) => {
    if (filename) {
      const cardId = parseInt(filename, 10);
      const card = cardDatastore.get(cardId);
      if (card) {
        controlObserver.set('card', { cardId: card.id, playlistId: card.playlistId });
      } else {
        console.error('Card ' + cardId + ' not Defined');
        controlObserver.set('card', { cardId: cardId, playlistId: null });
      }
    }
  });
} else {
  rfid((error, cardId) => {
    if (soundControl.card && (cardId === soundControl.card.cardId)) {
      return;
    }
    if (error) {
      console.error('Error: ' + error);
    } else {
      const card = cardDatastore.get(cardId);
      if (card) {
        controlObserver.set('card', { cardId: card.id, playlistId: card.playlistId });
      } else {
        console.error('Card ' + cardId + ' not Defined');
        controlObserver.set('card', { cardId: cardId, playlistId: null });
      }
    }
  });

  const musicPlayer = require('./musicPlayer');
  musicPlayer.getMopidy().on('state:online', function() {
    if (mopidyOnline) { return; }
    mopidyOnline = true;
    controlObserver.on('change', function(change) {
      if (webClientConnected) { return; }

      if (change.property[0] === 'card') {
        console.log('changed card to ' + soundControl.card.cardId);

        if (soundControl.card.cardId > 0) {
          console.log(lastCard.playlistId, soundControl.card.playlistId);

          if (lastCard.playlistId === soundControl.card.playlistId) {
            musicPlayer.resume();
          } else {
            musicPlayer.play(soundControl.card.playlistId);
          }
          lastCard = soundControl.card;
        } else {
          musicPlayer.pause();
        }
      }
    });
  });
}

const routes = require('./routes')(onAssignList);
require('./server')(routes, onIoConnection);
