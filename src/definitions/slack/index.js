import reply from './reply';

function has(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export default {
  url: 'Slackbot 1.0 (+https://api.slack.com/robots)',
  verb: 'POST',
  valid: body => has(body, 'event')// check structure
    && has(body.event, 'type')// check structure
    && body.api_app_id === process.env.API_APP_ID// basic check that req came from slack bot
    && body.event.type === 'app_mention'// only handle mentions
    && !has(body.event, 'edited'), // ignore edits
  id: body => body.event_id,
  collection: 'slack_messages',
  reply,
};
