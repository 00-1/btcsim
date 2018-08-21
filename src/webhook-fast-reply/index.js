import admin from 'firebase-admin';
import { config } from 'firebase-functions';

import end from './end';

// initialise app
admin.initializeApp(config().firebase);

// handle incoming webhook
export default (req, res, definitions) => {
  // get the definition by url
  const definition = definitions.filter(def => def.url === req.headers['user-agent'])[0];

  // check we have a definition for the url
  if (definition === undefined) {
    return end(res, 400, [
      'Undefined user-agent.',
      'Expected one of:',
      definitions,
      `Got: ${req.headers['user-agent']}`,
    ]);
  }

  // only deal with the correct HTTP verb
  if (req.method !== definition.verb) {
    return end(res, 405, [
      'Wrong HTTP verb.',
      `Expected: ${definition.verb}`,
      `Got: ${req.method}`,
    ]);
  }

  // check for valid JSON
  if (!definition.valid(req.body)) {
    return end(res, 400, [
      'Missing expected properties.',
      req.body,
    ]);
  }

  // check whether logging is enabled
  if (definition.log) {
  // get a document by message id (which may or may not already exist)
    const db = admin.firestore();
    const doc = db.collection(definition.collection).doc(definition.id(req.body));

    doc.get()
      .then((existing) => {
      // check if we've already handled a message with this id - ignore resends
        if (existing.exists) {
          return end(res, 200, [
            'Message already handled. Nothing to do.',
            existing.data()]);
        }

        // log the message
        return doc.set(req.body);
      }).catch((err) => {
        end(res, 500, [
          'Error getting accessing database.',
          err,
        ]);
      });
  }

  // handle the message
  const reply = definition.reply(req);
  return end(res, 200, reply);
};
