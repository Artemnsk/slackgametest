import * as Route from "route-parser";
import { ParsedSlackActionPayload } from "../helpers/slackmessage";
import { UIMessage } from "../models/uimessage/uimessage";
import { UIRouter } from "./uirouter";

export type ProcessActionsFunction = (uiRouter: UIRouter, parsedPayload: ParsedSlackActionPayload, args: object) => Promise<UIMessage>;
export type GetUIMessageFunction = (uiRouter: UIRouter, args: object) => Promise<UIMessage>;
export type ValidateRouteFunction = (uiRouter: UIRouter, path: string, parsedPayload?: ParsedSlackActionPayload) => Promise<null>;

export class UIRoute {
  public route: Route;
  public processActions: ProcessActionsFunction;
  public getUIMessage: GetUIMessageFunction;
  public validateRoute: ValidateRouteFunction;

  constructor(path: string, processActions: ProcessActionsFunction, getUIMessage: GetUIMessageFunction, validateRoute: ValidateRouteFunction) {
    this.route = new Route(path);
    this.processActions = processActions;
    this.getUIMessage = getUIMessage;
    this.validateRoute = validateRoute;
  }
}
