import request from 'request';

// post a reply in the channel
function chat(req, text) {
  request.post(
    `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
    { json: { text: `<@${req.body.event.user}> ${text}` } },
  );
}

export default chat;
