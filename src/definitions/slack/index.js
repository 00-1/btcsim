import reply from './reply';
import valid from './valid';

export default {
  url: 'Slackbot 1.0 (+https://api.slack.com/robots)',
  verb: 'POST',
  valid,
  reply,
  id: () => Date.now(),
  collection: 'slack_messages',
  log: true,
};
