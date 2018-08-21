import chat from './chat';
import has from './has';

// handles messages from slack
export default (req) => {
  // strip out message
  const message = req.body.event.text.split(`<@${req.body.authed_users[0]}>`).join('').split(' ').join('');

  // define valid commands
  const command = {
    readonly: ['score', 'history'],
    write: ['buy', 'sell'],
  };

  // handle commands based on type
  if (command.readonly.indexOf(message) > -1) { // handle 'read-only' commands
    chat(req, 'That is a `read-only` command.  This incident will be reported');
  } else if (command.write.indexOf(message) > -1) { // handle 'write' commands
    chat(req, 'That is a `write` command.  This incident will be reported.');
  } else { // handle invalid commands
    chat(req, `That is an invalid command, try \`${command.write.concat(command.readonly).join('`, `')}\`. This incident will be reported.`);
  }

  // when first connected to bot need to respond to challenge
  if (has(req.body, 'challenge')) {
    return { challenge: req.body.challenge };
  }
  return 'Sent message';
};
