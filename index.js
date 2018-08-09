const request = require('request');
const qs = require('querystring');
/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = (req, res) => {

  console.log(req)
  console.log(req.method=='POST')

  console.log(req.body)
  console.log(req.body.message)
  console.log(req.body.challenge)

  if (req.method == 'POST') {
	console.log('it is a post')
  }  else {

  let message = req.query.message || req.body.message || 'Hello World!';

  console.log(`Posting a message to https://hooks.slack.com/services/${process.env.SLACK_KEY}`)

  request.post(
    `https://hooks.slack.com/services/${process.env.SLACK_KEY}`,
    { json: { text: 'Hello World' } },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
  );

  res.status(200).send(message);

  }
};
