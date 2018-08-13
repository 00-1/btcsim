const request = require('request');
/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = (req, res) => {

  // log values
  console.log('method', req.method)
  console.log('body', req.body)
  console.log('slack url',  `https://hooks.slack.com/services/${process.env.SLACK_KEY}`)
  console.log('request', req)
  console.log('headers', req.headers)

  if (req.method == 'POST') {

    // when first connected to bot need to respond to challenge
    if (req.body.hasOwnProperty('challenge')) {
      res.status(200).send({challenge: req.body.challenge});
    } else if (req.body.event.type=='app_mention') {
      res.sendStatus(200); // give slack a 200

      request.post(
        `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
        { json: { text: 'Alright, message received.' } },
        function (error, response, body) {
	  console.log('Sent', error, response, body)
        }
      );
    } else {
      res.sendStatus(200); // give slack a 200
    }
  } else {
      res.sendStatus(200); // give slack a 200
  }
};
