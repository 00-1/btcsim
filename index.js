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

  console.log('new version')

  if (req.method == 'POST') {
        var body = '';
	console.log('it is a post')
        req.on('data', function (data) {
            body += data;
		console.log('reading data')
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });

        req.on('end', function () {
	    console.log('ended')
            var post = qs.parse(body);
	    console.log(post)
            res.status(200).send({challenge: post.challenge}); 
            // use post['blah'], etc.
        });
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
