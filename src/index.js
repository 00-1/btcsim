import reply from './webhook-fast-reply';
import slack from './definitions/slack';
import monitoring from './definitions/monitoring';

const definitions = {
  slack,
  monitoring,
};

/*
 * handles incoming webhook
 *
 */
export default (req, res) => reply(req, res, definitions);
