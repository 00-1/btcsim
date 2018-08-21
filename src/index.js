import admin from 'firebase-admin';
import { config } from 'firebase-functions';

import chat from './chat';
import end from './end';

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

const definition = {
  verb: 'POST',
  valid: body => has(body, 'event')// check structure
    && has(body.event, 'type')// check structure
    && body.event.api_app_id === process.env.API_APP_ID// basic check that req came from slack bot
    && body.event.type === 'app_mention'// only handle mentions
    && !has(body.event, 'edited'), // ignore edits
  id: body => body.event_id,
  collection: 'slack_messages',
  reply: (req) => {
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

    // when first connected to bot need to respond to challenge
    if (has(req.body, 'challenge')) {
      return { challenge: req.body.challenge };
    }
    return 'Sent message';
  },
};

// initialise app
admin.initializeApp(config().firebase);

/*
 * handles incoming webhook
 *
 */
export default (req, res) => {
  console.log(req.host);


  if (req.method === definition.verb) { // only deal with the correct HTTP verb
    if (definition.valid(req.body)) { // check for valid JSON
      const db = admin.firestore(); // initialise db
      const doc = db.collection(definition.collection) // get a document by message id
        .doc(definition.id(req.body)); // (which may or may not already exist)
      doc.get()
        .then((existing) => { // check if we've already stored a message with this id
          if (!existing.exists) { // ignore resends
            const reply = definition.reply(req); // initial reply
            doc.set(req.body); // write the message to db
            end(res, reply); // respond to request
          } else { end(res, ['Message already handled.', existing.data()]); }
        }).catch((err) => { end(res, ['Error getting accessing database.', err]); });
    } else { end(res, ['Missing expected properties.', req.body]); }
  } else { end(res, ['Wrong HTTP verb.', `Expected: ${definition.verb}`, `Got: ${req.method}`]); }
};
