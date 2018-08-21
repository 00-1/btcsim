import wfr from './webhook-fast-reply';
import slack from './definitions/slack';
import monitoring from './definitions/monitoring';

const definitions = [
  slack,
  monitoring,
];

// route request through webhook-fast-reply, with definitions
export default (req, res) => wfr(req, res, definitions);
