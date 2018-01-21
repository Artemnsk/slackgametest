import * as admin from "firebase-admin";
import { firebaseApp } from "../helpers/firebaseapp";
import { Channel } from "../models/channel/channel";
import { CHANNEL_PHASES } from "../models/channel/dbfirebase";
import { Game } from "../models/game/game";
import { GameActionRequestFirebaseValueRaw } from "../models/gameactionrequest/dbfirebase";
import { GameActionRequest } from "../models/gameactionrequest/gameactionrequest";
import { buildGameActionRequest } from "../models/gameactionrequest/gameactionrequestfactory";

type GameActionRequestData = {
  request: GameActionRequestFirebaseValueRaw,
  key: string,
};

export class ChannelLoop {
  private channel: Channel;
  private gameActionRequestsRef: admin.database.Reference | null = null;
  private gameActionRequestsData: GameActionRequestData[] = [];

  constructor(channel: Channel) {
    this.channel = channel;
    switch (channel.phase) {
      case CHANNEL_PHASES.BREAK:
        // Waiting for game to start.
        this.waitingForGameStart();
        break;
      case CHANNEL_PHASES.IN_GAME:
        this.gameActionRequestsRef = firebaseApp.database().ref(`/actionRequests/${channel.getTeamKey()}/${channel.getKey()}/${channel.currentGame}`);
        this.gameActionRequestsRef.on("child_added", this.gameActionRequestAdded, this);
        this.processGame();
        break;
    }
  }

  public getChannelKey(): string {
    return this.channel.getKey();
  }

  // Handles destroying of object - needed to "off" Firebase listeners.
  public destroy(): void {
    if (this.gameActionRequestsRef !== null) {
      this.gameActionRequestsRef.off("child_added", this.gameActionRequestAdded, this);
    }
  }

  private waitingForGameStart(): void {
    setTimeout(() => {
      const nextGame = this.channel.nextGame;
      if (nextGame !== null) {
        const now = Date.now();
        if (nextGame <= now) {
          // That will trigger channel change which triggers replacement/destroying of this channel in teamloop.
          this.channel.startGame();
        } else {
          // Otherwise keep waiting.
          this.waitingForGameStart();
        }
      }
    }, 2000);
  }

  private processGame(): void {
    setTimeout(() => {
      if (this.channel.currentGame !== null) {
        Game.getGame(this.channel, this.channel.currentGame)
          .then((game) => {
            if (game !== null) {
              if (this.gameActionRequestsData.length > 0) {
                const gameActionRequest = buildGameActionRequest(game, this.gameActionRequestsData[0].request, this.gameActionRequestsData[0].key);
                if (gameActionRequest !== null) {
                  const gameAction = gameActionRequest.toGameAction();
                  if (gameAction !== null) {
                    gameAction.processGameStep()
                      .then(() => {
                        // Remove this game action from array and run default game processing loop.
                        const index = this.gameActionRequestsData.findIndex((item) => item.key === gameActionRequest.getKey());
                        if (index !== -1) {
                          this.gameActionRequestsData.splice(index, 1);
                        }
                        game.defaultGameProcessing()
                          .then(() => {
                            // Remove this game action from array and run default game processing loop.
                            const index = this.gameActionRequestsData.findIndex((item) => item.key === gameActionRequest.getKey());
                            if (index !== -1) {
                              this.gameActionRequestsData.splice(index, 1);
                            }
                            GameActionRequest.removeGameActionRequest(game, gameActionRequest.getKey())
                              .then(() => {
                                this.processGame();
                              }, () => {
                                this.processGame();
                              });
                          }, () => {
                            // TODO: that is actually bad because we cannot proceed. Maybe Pause/Over game?
                            // Remove this game action from array and run default game processing loop.
                            const index = this.gameActionRequestsData.findIndex((item) => item.key === gameActionRequest.getKey());
                            if (index !== -1) {
                              this.gameActionRequestsData.splice(index, 1);
                            }
                            GameActionRequest.removeGameActionRequest(game, gameActionRequest.getKey())
                              .then(() => {
                                this.processGame();
                              }, () => {
                                this.processGame();
                              });
                          });
                      }, () => {
                        // Remove this game action from array and proceed.
                        const index = this.gameActionRequestsData.findIndex((item) => item.key === gameActionRequest.getKey());
                        if (index !== -1) {
                          this.gameActionRequestsData.splice(index, 1);
                        }
                        GameActionRequest.removeGameActionRequest(game, gameActionRequest.getKey())
                          .then(() => {
                            this.processGame();
                          }, () => {
                            this.processGame();
                          });
                      });
                  } else {
                    this.gameActionRequestsData.splice(0, 1);
                    GameActionRequest.removeGameActionRequest(game, gameActionRequest.getKey())
                      .then(() => {
                        this.processGame();
                      }, () => {
                        this.processGame();
                      });
                  }
                } else {
                  this.gameActionRequestsData.splice(0, 1);
                  GameActionRequest.removeGameActionRequest(game, this.gameActionRequestsData[0].key)
                    .then(() => {
                      this.processGame();
                    }, () => {
                      this.processGame();
                    });
                }
              } else {
                // Default gaem prrocessing.
                game.defaultGameProcessing()
                  .then(() => {
                    this.processGame();
                  }, () => {
                    // TODO: that is actually bad because we cannot proceed. Maybe Pause/Over game?
                  });
              }
            } else {
              // TODO: definitely some error.. Maybe even over game?
            }
          }, (err) => {
            // Proceed anyway.
            // TODO: error log?
            this.processGame();
          });
      }
    }, 2000);
  }

  private gameActionRequestAdded(snapshot: admin.database.DataSnapshot): void {
    if (this.channel.currentGame !== null) {
      const gameActionRequestFirebaseValueRaw: GameActionRequestFirebaseValueRaw | null = snapshot.val();
      if (gameActionRequestFirebaseValueRaw !== null && snapshot.key !== null) {
        const gameActionRequestData: GameActionRequestData = {
          key: snapshot.key,
          request: gameActionRequestFirebaseValueRaw,
        };
        this.gameActionRequestsData.push(gameActionRequestData);
      }
    }
  }
}
