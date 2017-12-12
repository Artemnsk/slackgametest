"use strict";

const privateCredentials = require('../../../credentials/private');
const Slack = require('slack-node');
const slack = new Slack(privateCredentials.sandboxAccessToken);

class UIMessage {
  constructor() {
    this.sendParameters = {};
    this.uiAttachments = [];
  }

  /**
   *
   * @param {Array<Object>} uiAttachments
   */
  setUIAttachments(uiAttachments) {
    this.uiAttachments = uiAttachments;
  }

  /**
   *
   * @param {Object} params
   */
  setSendParameters(params) {
    Object.assign(this.sendParameters, params);
  }

  /**
   * Sends UIMessage to Slack.
   */
  toJSON() {
    let json = Object.assign({}, this.sendParameters);
    json.attachments = this.uiAttachments;
    return json;
  }
}

module.exports = UIMessage;