const request = require('request');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

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

            // post a reply in the channel
            request.post(
              `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
              { json: { text:  
                ['history', 'score'].indexOf(message) > -1 ? a`<@${req.body.event.user}> That is a \`read-only\` command.  This incident will be reported` 
                : (['buy', 'sell'].indexOf(message) > -1 ? `<@${req.body.event.user}> That is a \`write\` command.  This incident will be reported.` 
                : `<@${req.body.event.user}> That is an invalid command. This incident will be reported.` )
              } },
              (error, response, body) => {
                console.log('Sent slack message', error, response, body);
                res.sendStatus(200);
              },
            );

            // write the message to db
            doc.set(req.body);
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
