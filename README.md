🌲 Responds quickly to webhook events, e.g. from [Slack Events API](https://api.slack.com/events-api).

> Responding quickly helps avoid [timeouts](https://api.slack.com/events-api#failure_conditions) and gives the user feedback sooner.

🥦 Checks whether the event has already been received, by looking for a document with the message id in the database.

> APIs resend webhook events if they fail (e.g. due to timeout). Not doing this check can cause the reply to be repeated.

🌳 If it's a new event, sends a reply.

> Replies are defined per webhook, and should consist of a quick initial response to the event, e.g. [replying in slack](https://api.slack.com/incoming-webhooks).

🌴 If it's a new event, writes a document to [Google Cloud Firestore](https://firebase.google.com/docs/firestore/).

> Another function that performs more time-costly work can be set to trigger on new document writes. 

🎄 Designed to be deployed as a serverless [Google Cloud Function](https://cloud.google.com/functions/docs/).

