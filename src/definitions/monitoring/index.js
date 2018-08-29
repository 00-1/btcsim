// simple reply definition for google cloud monitoring
export default {
  url: 'GoogleStackdriverMonitoring-UptimeChecks(https://cloud.google.com/monitoring)',
  verb: 'GET',
  valid: () => true,
  reply: () => 'OK',
  log: true,
  collection: 'monitoring',
  id: () => Date.now(),
};
