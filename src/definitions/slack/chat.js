import request from 'request';

// posts a reply in a slack channel
export default (req, text) => request.post(
  `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
  { json: { text: `<@${req.body.event.user}> ${text}` } },
);
