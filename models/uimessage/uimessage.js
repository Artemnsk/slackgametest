"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UIMessage {
    constructor() {
        this.sendParameters = {};
        this.uiAttachments = [];
    }
    setUIAttachments(uiAttachments) {
        this.uiAttachments = uiAttachments;
    }
    setSendParameters(params) {
        Object.assign(this.sendParameters, params);
    }
    /**
     * Prepare JSON to send to Slack.
     */
    toJSON() {
        return Object.assign({}, this.sendParameters, { attachments: this.uiAttachments });
    }
}
exports.UIMessage = UIMessage;
//# sourceMappingURL=uimessage.js.map