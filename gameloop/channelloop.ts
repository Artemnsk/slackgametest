import { Channel } from "../models/channel/channel";
import { CHANNEL_PHASES } from "../models/channel/dbfirebase";
import { Game, GAME_STEP_RESULTS } from "../models/game/game";

export class ChannelLoop {
  private static CHANNEL_LOOP_FREQUENCY_BREAK = 5000;
  private static CHANNEL_LOOP_FREQUENCY_IN_GAME = 2000;
  private channel: Channel;
  private inProgress: boolean = false;

  constructor(channel: Channel) {
    this.channel = channel;
  }

  public start(): void {
    this.inProgress = true;
    this.loop();
  }

  public pause(): void {
    this.inProgress = false;
  }

  private loop(): void {
    switch (this.channel.phase) {
      case CHANNEL_PHASES.BREAK:
        this.breakStep();
        break;
      case CHANNEL_PHASES.IN_GAME:
        this.inGameStep();
        break;
    }
  }

  private breakStep(): void {
    if (this.channel.nextGame !== null) {
      if (Date.now() > this.channel.nextGame) {
        this.channel.startGame()
          .then(() => {
            this.repeatChannelLoop();
          }, () => {
            // TODO: error. Log it and retry. Maybe retry MUCH later?
            this.repeatChannelLoop();
          });
      } else {
        // OK. Wait for game time.
        this.repeatChannelLoop();
      }
    } else {
      // TODO: error. Something went wrong actually. Do not even start loop again.
    }
  }

  private inGameStep(): void {
    if (this.channel.currentGame !== null) {
      // Load game and delegate loop to it.
      Game.getGame(this.channel, this.channel.currentGame)
        .then((game) => {
          if (game !== null) {
            this.repeatGameLoop(game, ChannelLoop.CHANNEL_LOOP_FREQUENCY_IN_GAME);
          } else {
            // TODO: error - game not found.
          }
        }, () => {
          // TODO: error - DB connection or something?
        });
    } else {
      // That is actually error.
    }
  }

  private repeatChannelLoop(): void {
    if (this.inProgress) {
      setTimeout(() => this.start(), ChannelLoop.CHANNEL_LOOP_FREQUENCY_BREAK);
    }
  }

  /**
   * Repeats game loop if channel loop is in progress.
   */
  private repeatGameLoop(game: Game, frequency: number): void {
    if (this.inProgress) {
      setTimeout(() => {
        game.gameStep()
          .then((result) => {
            switch (result) {
              case GAME_STEP_RESULTS.DEFAULT:
                // Run game again later.
                this.repeatGameLoop(game, ChannelLoop.CHANNEL_LOOP_FREQUENCY_IN_GAME);
                break;
              case GAME_STEP_RESULTS.END:
                this.repeatChannelLoop();
                break;
              case GAME_STEP_RESULTS.ERROR:
                // TODO:
                break;
            }
          }, () => {
            // TODO: is that some code error or something? Is that actually a reachable code?
          });
      }, frequency);
    }
  }
}
