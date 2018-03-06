const mfrc522 = require('mfrc522-rpi');

function rfidEvents (cardCallback) {

  mfrc522.initWiringPi(0);

  setInterval(function(){
    mfrc522.reset();

    // Scan for cards
    let response = mfrc522.findCard();
    if (!response.status) {
      cardCallback(null, 0);
      return;
    }

    // Get the UID of the card
    response = mfrc522.getUid();
    if (!response.status) {
      cardCallback("UID Scan Error", null);
      return;
    }
    // If we have the UID, continue
    const uid = response.data;
    const memoryCapacity = mfrc522.selectCard(uid);
    const key = [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF];

    // Authenticate on Block 8 with key and uid
    if (!mfrc522.authenticate(8, key, uid)) {
      cardCallback("Authentication Error", null);
      return;
    }

    const carId = mfrc522.getDataForBlock(8)[0];

    // Dump Block 8
    cardCallback(null, carId);

    mfrc522.stopCrypto();
  }, 500);
};

exports = module.exports = rfidEvents;
