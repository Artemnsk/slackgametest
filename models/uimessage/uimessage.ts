export class UIMessage {
  public sendParameters: object;
  public uiAttachments: object[];

  constructor() {
    this.sendParameters = {};
    this.uiAttachments = [];
  }

  public setUIAttachments(uiAttachments: object[]): void {
    this.uiAttachments = uiAttachments;
  }

  public setSendParameters(params: object): void {
    Object.assign(this.sendParameters, params);
  }

  /**
   * Prepare JSON to send to Slack.
   */
  public toJSON() {
    return Object.assign({}, this.sendParameters, { attachments: this.uiAttachments });
  }
}
