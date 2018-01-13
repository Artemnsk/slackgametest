import * as inquirer from "inquirer";
import { Channel } from "../../models/channel/channel";
import { CHANNEL_PHASES } from "../../models/channel/dbfirebase";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen, separator } from "../helpers";
import { InstallationRouter } from "../router";

const stdout = process.stdout;
const CHANNEL_START_GAME = "Start Game";
const CHANNEL_OVER_GAME = "Over Game";
const CHANNEL_BACK = "Back";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";

export function channelRoute(args: {team: Team, channelKey: string}, router: InstallationRouter): void {
  const loadingScreenInterval = loadingScreen();
  Channel.getChannel(args.team, args.channelKey)
    .then((channel) => {
      clearInterval(loadingScreenInterval);
      if (channel !== null) {
        clearConsole();
        stdout.write("CHANNEL INFO\n");
        stdout.write(`$key: ${channel.getKey()}\n`);
        stdout.write(`name: ${channel.name}\n`);
        stdout.write(`phase: "${channel.phase}"\n`);
        stdout.write(`timeStep: ${channel.timeStep}\n`);
        stdout.write(`breakTime: ${channel.breakTime}\n`);
        stdout.write(`nextGame: ${channel.nextGame ? channel.nextGame : "NOT SET"} ${channel.nextGame ? `[${new Date(channel.nextGame)}]` : ""}\n`);
        stdout.write(`currentGame: [${channel.currentGame ? channel.currentGame : "NOT SET"}]\n`);
        stdout.write(`active: ${(channel.active === true ? "true" : "false")}\n`);
        // TODO: show details of current game if exists.
        inquirer.prompt([
          {
            choices: [
              {
                disabled: channel.phase !== CHANNEL_PHASES.BREAK ? `Disabled: phase is not "${CHANNEL_PHASES.BREAK}"` : "",
                name: CHANNEL_START_GAME,
              }, {
                disabled: channel.phase !== CHANNEL_PHASES.IN_GAME ? `Disabled: phase is not "${CHANNEL_PHASES.IN_GAME}"` : "",
                name: CHANNEL_OVER_GAME,
              },
              CHANNEL_BACK,
            ],
            message: separator,
            name: "option",
            type: "list",
          },
        ]).then((answers: {option: string}) => {
          clearConsole();
          switch (answers.option) {
            case CHANNEL_OVER_GAME:
              router.channelOverGameRoute({ team: args.team, channel }, router);
              break;
            case CHANNEL_START_GAME:
              router.channelStartGameRoute({ team: args.team, channel }, router);
              break;
            case CHANNEL_BACK:
              router.channelsRoute({ team: args.team }, router);
              break;
            default:
              process.exit(1);
              break;
          }
        });
      } else {
        _errorCallback("Channel doesn't exist.", args, router);
      }
    }, (error) => {
      clearInterval(loadingScreenInterval);
      _errorCallback(error.message, args, router);
    });
}

/**
 *
 * @param {string} message
 * @param {{team: Team, channelKey: string}} args
 * @param {InstallationRouter} router
 */
function _errorCallback(message: string, args: {team: Team, channelKey: string}, router: InstallationRouter): void {
  clearConsole();
  inquirer.prompt([
    {
      choices: [ ERROR_TRY_AGAIN, ERROR_BACK ],
      message: "Error occurred: " + message,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case ERROR_TRY_AGAIN:
        router.channelRoute(args, router);
        break;
      case ERROR_BACK:
        router.channelsRoute({ team: args.team }, router);
        break;
    }
  });
}
