const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('datastore/card_datastore.json');
const db = low(adapter);

function cardDatastore() {
  db.defaults({ cards: [] }).write();

  return {
    set: (id, playlistId) => {
      const card = db.get('cards').find({ id: id }).value();
      if (card) {
        return db
                .get('cards')
                .find({ id: id })
                .assign({ playlistId: playlistId })
                .write();
      }

      return db
              .get('cards')
              .push({ id: id, playlistId: playlistId })
              .write();
    },
    get: (id) => {
      return db
              .get('cards')
              .find({ id: id })
              .value();
    },
  };
}

module.exports = cardDatastore();
