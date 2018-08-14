const request = require('request');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

function chat(req, text) {
  // post a reply in the channel
  request.post(
    `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
    { json: { text: `<@${req.body.event.user}> ${text}` } },
    (error, response, body) => { console.log('Sent slack message', error, response, body); },
  );
}

// takes a slack message and writes it to the db
exports.btcsim = (req, res) => {
  // only deal with POSTs
  if (req.method === 'POST') {
    // when first connected to bot need to respond to challenge
    if (req.body.hasOwnProperty('challenge')) {
      res.status(200).send({ challenge: req.body.challenge });

    // otherwise check if the bot was mentioned
    } else if (req.body.event.type === 'app_mention') {
      // initialise db
      admin.initializeApp(functions.config().firebase);
      const db = admin.firestore();

      // check if we've already stored this message
      // (slack can resend messages if it gets a timeout)
      const doc = db.collection('messages').doc(req.body.event_id);
      doc.get()
        .then((existing) => {
          // check if the document was already written
          if (!existing.exists) {
            // strip out message
            const message = req.body.event.text.split(`<@${req.body.authed_users[0]}>`).join('').split(' ').join('');

            // define valid commands
            const command = {
              readonly: ['history', 'score'],
              write: ['buy', 'sell'],
            };

            // handle commands based on type
            if (command.readonly.indexOf(message) > -1) { // handle 'read-only' commands
              chat(req, 'That is a `read-only` command.  This incident will be reported');
            } else if (command.write.indexOf(message) > -1) { // handle 'write' commands
              chat(req, 'That is a `write` command.  This incident will be reported.');
            } else { // handle invalid commands
              chat(req, `That is an invalid command, try \`${[command.write.join(), command.readonly.join()].join()}\` . This incident will be reported.`);
            }

            // write the message to db
            doc.set(req.body);
            res.sendStatus(200);
          } else {
            console.log('Already exists', existing.data());
            res.sendStatus(200);
          }
        })
        .catch((err) => {
          console.log('Error getting documents', err);
          res.sendStatus(200);
        });
    } else {
      console.log('Missing expected properties', req.body);
      res.sendStatus(200);
    }
  } else {
    console.log('Not a POST', req.method);
    res.sendStatus(200);
  }
};
