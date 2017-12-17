"use strict";

module.exports = {
  // Whether or not to use SSL. SSL is always used for live Slack apps however that could be skipped for local development inside app's workspace.
  useSSL: false,
  // Needed to build authorize allowed request only.
  protocol: 'http',
  // Needed to build authorize allowed request only.
  host: 'localhost',
  // Slack app client_id. Retrieved on App dashboard in settings tab.
  client_id: '<>',
  // This token is simply used to know that request being done from Slack. Like an additional not fully reliable protection against attacks.
  verification_token: '<>'
};