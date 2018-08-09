const request = require('request');

/**
 * Responds to any HTTP request.
 *
 * @param {!Object} req HTTP request context.
 * @param {!Object} res HTTP response context.
 */
exports.btcsim = (req, res) => {

  console.log(req)
  console.log(req.method=='POST')

    var POST = {};
    if (req.method == 'POST') {
        req.on('data', function(data) {
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }
            console.log(POST);
            res.status(200).send(POST.challenge);
        })
    }

  if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
          console.log(JSON.parse(jsonString));


        });
  }

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
};
