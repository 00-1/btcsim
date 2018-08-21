import admin from 'firebase-admin';
import { config } from 'firebase-functions';

import chat from './chat';
import end from './end';

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

const definitions = [
  {
    url: 'Slackbot 1.0 (+https://api.slack.com/robots)',
    verb: 'POST',
    valid: body => has(body, 'event')// check structure
    && has(body.event, 'type')// check structure
    && body.api_app_id === process.env.API_APP_ID// basic check that req came from slack bot
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
    log: true,
  },
  {
    url: 'GoogleStackdriverMonitoring-UptimeChecks(https://cloud.google.com/monitoring)',
    verb: 'GET',
    valid: () => true,
    id: () => 0,
    collection: 0,
    reply: () => 'OK',
    log: false,
  },
];

// initialise app
admin.initializeApp(config().firebase);

/*
 * handles incoming webhook
 *
 */
export default (req, res) => {

  // get the definition by url
  const definition = definitions.filter(def => def.url > req.headers['user-agent']);

  // only deal with the correct HTTP verb
  if (req.method !== definition.verb) {
    return end(res, [
      'Wrong HTTP verb.',
      `Expected: ${definition.verb}`,
      `Got: ${req.method}`,
    ]);
  }

  // check for valid JSON
  if (!definition.valid(req.body)) {
    return end(res, [
      'Missing expected properties.',
      req.body,
    ]);
  }

  // get a document by message id (which may or may not already exist)
  const db = admin.firestore();
  const doc = db.collection(definition.collection).doc(definition.id(req.body));

  return doc.get()
    .then((existing) => {
      // check if we've already handled a message with this id - ignore resends
      if (existing.exists) {
        return end(res, [
          'Message already handled.',
          existing.data()]);
      }

      // log the message if required
      if (definition.log) {
        doc.set(req.body);
      }

      // handle the message
      const reply = definition.reply(req);
      return end(res, reply);
    }).catch((err) => {
      end(res, [
        'Error getting accessing database.',
        err,
      ]);
    });
};
