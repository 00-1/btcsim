import has from './has';

// checks for a valid slack message
export default body => has(body, 'event')// check structure
    && has(body.event, 'type')// check structure
    && body.api_app_id === process.env.API_APP_ID// basic check that req came from slack bot
    && body.event.type === 'app_mention'// only handle mentions
    && !has(body.event, 'edited'); // ignore edits
