const request = require('request');

const functions = require('firebase-functions');                                                                                                                                                                                                
                                                                                                                                                                                                                                                
// The Firebase Admin SDK to access the Firebase Realtime Database.                                                                                                                                                                             
const admin = require('firebase-admin');                                                                                                                                                                                                        
admin.initializeApp();    

/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = functions.https.onRequest(async (req, res) => {

    // log values
  console.log('method', req.method)
  console.log('body', req.body)
  console.log('slack url', `https://hooks.slack.com/services/${process.env.SLACK_KEY}`)

  // deal with posts
  if (req.method == 'POST') {

    // when first connected to bot need to respond to challenge
    if (req.body.hasOwnProperty('challenge')) {
      res.status(200).send({challenge: req.body.challenge});
    } else if (req.body.event.type=='app_mention') {
      // store query
      const writeResult = await admin.firestore().collection('messages').add(req.body); 

      console.log(writeResult);

      // respond to query
      request.post(
        `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
        { json: { text: 'Alright, message received.' } },
        function (error, response, body) {
	  console.log('Sent', error, response, body)
        }
      );
    }
  }

// give slack a 200 ASAP to avoid 3000ms timeout
  // note this has to be disabled to send a meaningful response, like the challenge reply
  res.sendStatus(200);


});
