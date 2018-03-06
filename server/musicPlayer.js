const Mopidy = require('mopidy');
const mopidy = new Mopidy({
  webSocketUrl: 'ws://localhost:6680/mopidy/ws/',
  callingConvention: 'by-position-or-by-name',
});

function musicPlayer() {
  return {
    getMopidy: () => {
      return mopidy;
    },

    play: (playlistUri) => {
      mopidy.playback.getState({}).then(function(mpState) {
        if (mpState === 'playing') { return; }
        mopidy.tracklist.clear({}).then(function() {
          mopidy.tracklist.add({uri: playlistUri}).then(function() {
            console.log('STATE: ', 'play');
            mopidy.playback.play();
          });
        });
      });
    },

    resume: () => {
      mopidy.playback.getState({}).then(function(mpState) {
        if (mpState === 'playing') { return; }
        console.log('STATE: ', 'resume');
        mopidy.playback.play();
      });
    },

    pause: () => {
      mopidy.playback.getState({}).then(function(mpState) {
        if (mpState === 'paused') { return; }
        console.log('STATE: ', 'pasue');
        mopidy.playback.pause();
      });
    },

    stop: () => {
      mopidy.playback.stop({}).then(function() {
        mopidy.tracklist.clear({});
      });
    },

    exit: () => {
      mopidy.close();
      mopidy.off();
      mopidy = null;
    },
  };
}

mopidy.connect();
module.exports = musicPlayer();
