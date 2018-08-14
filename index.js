const request = require('request');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// post a reply in the channel
function chat(req, text) {
  request.post(
    `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
    { json: { text: `<@${req.body.event.user}> ${text}` } },
    (error, response, body) => { console.log('Sent slack message', error, response, body); },
  );
}

// end the request
function end(res, text) {
  console.log(text);
  res.status(200).send(text);
}

// takes a slack message and writes it to the db
exports.btcsim = (req, res) => {
  // only deal with POSTs
  if (req.method === 'POST') {
    // when first connected to bot need to respond to challenge
    if (req.body.hasOwnProperty('challenge')) {
      end(res, { challenge: req.body.challenge });

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
              readonly: ['score', 'history'],
              write: ['buy', 'sell'],
            };

            // handle commands based on type
            if (command.readonly.indexOf(message) > -1) { // handle 'read-only' commands
              chat(req, 'That is a `read-only` command.  This incident will be reported');
            } else if (command.write.indexOf(message) > -1) { // handle 'write' commands
              chat(req, 'That is a `write` command.  This incident will be reported.');
            } else { // handle invalid commands
              chat(req, `That is an invalid command, try \`${command.write.concat(command.readonly).join('`, `')}\`. This incident will be reported.`);
            }

            // write the message to db
            doc.set(req.body);
            end(res, 'Sent slack message');
          } else { end(res, ['Already exists', existing.data()]); }
        })
        .catch((err) => { end(res, ['Error getting documents', err]); });
    } else { end(res, ['Missing expected properties', req.body]); }
  } else { end(res, `Not a POST ${req.method}`); }
};
