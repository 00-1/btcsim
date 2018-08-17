#### 🌲

Responds quickly to webhook events, e.g. from [Slack Events API](https://api.slack.com/events-api).

> Responding quickly helps avoid [timeouts](https://api.slack.com/events-api#failure_conditions) and gives the user feedback sooner.

#### 🥦

Checks the message hasn't already been received, and if not posts a reply to `REPLY_URL`.

> APIs resend webhook events if they fail (e.g. due to timeout). Not doing this check can cause the reply to be repeated.

#### 🌳 

Received message is written to [Google Cloud Firestore](https://firebase.google.com/docs/firestore/).

> Another function, set to trigger on new document writes, might now be triggered to perform more time costly work.

#### 🎄

Designed to be deployed as a serverless [Google Cloud Function](https://cloud.google.com/functions/docs/).

> Expects environment variables `VALID_COMMANDS` and `REPLY_URL`.

