const request = require('request');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// takes a slack message and writes it to the db
exports.btcsim = (req, res) => {

  // give slack a 200 ASAP to avoid 3000ms timeout
  // note this has to be disabled to send a meaningful response, like the challenge reply
  console.log('responding asap')
  res.sendStatus(200);

  console.log(req.body)

  // only deal with POSTs
  if (req.method == 'POST') {

    // when first connected to bot need to respond to challenge
    if (req.body.hasOwnProperty('challenge')) {
      res.status(200).send({challenge: req.body.challenge});

    // otherwise check if the bot was mentioned
    } else if (req.body.event.type=='app_mention') {

      // initialise db
      admin.initializeApp(functions.config().firebase);
      const db = admin.firestore();

      // check if we've already stored this message
      // (slack can resend messages if it gets a timeout)
      const doc = db.collection('messages').doc(req.body.event_id) 
      doc.get()
       .then((existing) => {
         // check if the document was already written
         if (!existing.exists) {

            console.log("It exists", existing)

            // respond to query
            request.post(
              `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
              { json: { text: '🎑 Alright, message received. This incident will be reported.' } },
              function (error, response, body) {
	        console.log('Sent', error, response, body)
              }
            );

            // write the message to db         
            doc.set(req.body); 

         } else {
           console.log("Already exists", existing.data())
         }

       })      
      .catch((err) => {
        console.log('Error getting documents', err);
      });
    }
  }
};

