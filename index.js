const request = require('request');
/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = (req, res) => {

  if (req.method == 'POST') {
    console.log('it is a post')
    console.log(req.body)
    if (req.body.hasOwnProperty('challenge')) {
      res.status(200).send({challenge: req.body.challenge});
    } else if (req.body.event.type=='app_mention') {
      console.log('mentioned')

      console.log(`Posting a message to https://hooks.slack.com/services/${process.env.SLACK_KEY}`)

      request.post(
        `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
        { json: { text: 'Alright, message received.' } },
        function (error, response, body) {
	  console.log('Sent', error, response, body)
            res.status(200).send('Thanks for the POST');
	  }
        }
      );
    } else {
      res.status(200).send('Thanks for the POST');
    }
  } else {

  let message = req.query.message || req.body.message || 'Hello World!';
  
  res.status(200).send(message);

  }
};
