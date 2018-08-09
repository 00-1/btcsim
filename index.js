/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = (req, res) => {
  let message = req.query.message || req.body.message || 'Hello World!';

  var request = require('request');

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
};
