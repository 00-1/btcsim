import reply from './reply';
import valid from './valid';

export default {
  url: 'Slackbot 1.0 (+https://api.slack.com/robots)',
  verb: 'POST',
  valid,
  reply,
  id: body => body.event_id,
  collection: 'slack_messages',
  log: true,
};
