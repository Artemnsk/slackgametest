import { ParsedSlackActionPayload } from "../helpers/slackmessage";
import { Channel } from "../models/channel/channel";
import { Game } from "../models/game/game";
import { Gamer } from "../models/gamer/gamer";
import { Player } from "../models/player/player";
import { UIMessage } from "../models/uimessage/uimessage";
import { uiRoute as newplayerUIRoute } from "./newplayer";
import { UIRoute } from "./uiroute";

import { uiRoute as rootUIRoute } from "./";
import { uiRoute as breakmenuUIRoute } from "./breakmenu";
import { uiRoute as shopUIRoute } from "./breakmenu/shop";
import { uiRoute as gamemenuUIRoute } from "./gamemenu";
import { uiRoute as castspellUIRoute } from "./gamemenu/castspell";
import { uiRoute as gamersListUIRoute } from "./gamemenu/gamerslist";
import { uiRoute as useItemUIRoute } from "./gamemenu/useitem";
import { uiRoute as informationMessageUIRoute } from "./informationmessage";

// TODO: actually we can make prototype which can be used with reassigning game data for better performance.
export class UIRouter {
  public channel: Channel;
  public player: Player|null;
  public game: Game|null;
  public gamer: Gamer|null;
  // UIRoutes.
  public rootUIRoute: UIRoute;
  public informationMessageUIRoute: UIRoute;
  public newplayerUIRoute: UIRoute;
  public breakmenuUIRoute: UIRoute;
  public shopUIRoute: UIRoute;
  public gamemenuUIRoute: UIRoute;
  public castspellUIRoute: UIRoute;
  public useItemUIRoute: UIRoute;
  public gamersListUIRoute: UIRoute;

  constructor(channel: Channel, player: Player|null, game: Game|null, gamer: Gamer|null) {
    this.channel = channel;
    this.player = player;
    this.game = game;
    this.gamer = gamer;
    // Define UIRoutes.
    this.informationMessageUIRoute = informationMessageUIRoute;
    this.rootUIRoute = rootUIRoute;
    this.newplayerUIRoute = newplayerUIRoute;
    this.breakmenuUIRoute = breakmenuUIRoute;
    this.shopUIRoute = shopUIRoute;
    this.gamemenuUIRoute = gamemenuUIRoute;
    this.castspellUIRoute = castspellUIRoute;
    this.useItemUIRoute = useItemUIRoute;
    this.gamersListUIRoute = gamersListUIRoute;
  }

  public getUIMessage(path: string, parsedPayload?: ParsedSlackActionPayload): Promise<UIMessage> {
    // In case we have no parsed payload - that actually means that user loads app menu first time via Slack command.
    if (parsedPayload === undefined) {
      return this.rootUIRoute.getUIMessage(this, {});
    }
    const uiRoutes: UIRoute[] = [
      this.informationMessageUIRoute,
      this.rootUIRoute,
      this.newplayerUIRoute,
      this.breakmenuUIRoute,
      this.shopUIRoute,
      this.gamemenuUIRoute,
      this.castspellUIRoute,
      this.useItemUIRoute,
      this.gamersListUIRoute,
    ];
    return this.getValidateFunctionsPromiseChain(uiRoutes, path, parsedPayload)
      .then(() => {
        for (const uiRoute of uiRoutes) {
          const args = uiRoute.route.match(path);
          if (args !== false) {
            return uiRoute.processActions(this, parsedPayload, args);
          }
        }
        // ..otherwise route not found.
        const text = "Route not found.";
        return this.informationMessageUIRoute.getUIMessage(this, { text });
      }, (err) => {
        return this.informationMessageUIRoute.getUIMessage(this, { text: err.message });
      });
  }

  /**
   * Loop through array of UIRoutes and validate each route in chain until all routes validated or error appears.
   */
  private getValidateFunctionsPromiseChain(arr: UIRoute[], path: string, parsedPayload: ParsedSlackActionPayload): Promise<null> {
    // Copy init array to not break it.
    const arrCopy: UIRoute[] = [ ...arr ];
    const firstItem = arrCopy.shift();
    if (firstItem !== undefined) {
      return firstItem.validateRoute(this, path, parsedPayload)
        .then(() => this.getValidateFunctionsPromiseChain(arrCopy, path, parsedPayload));
    }
    return Promise.resolve(null);
  }
}
