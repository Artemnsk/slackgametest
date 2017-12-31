"use strict";

class UIMessage {
  /**
   * @constructor
   * @property {Object} sendParameters
   * @property {Array<SlackMessageAttachment>} uiAttachments
   */
  constructor() {
    this.sendParameters = {};
    this.uiAttachments = [];
  }

  /**
   *
   * @param {Array<SlackMessageAttachment>} uiAttachments
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