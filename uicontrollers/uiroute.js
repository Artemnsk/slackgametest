"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Route = require("route-parser");
class UIRoute {
    constructor(path, processActions, getUIMessage, validateRoute) {
        this.route = new Route(path);
        this.processActions = processActions;
        this.getUIMessage = getUIMessage;
        this.validateRoute = validateRoute;
    }
}
exports.UIRoute = UIRoute;
//# sourceMappingURL=uiroute.js.map