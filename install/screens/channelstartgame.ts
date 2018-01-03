import * as inquirer from "inquirer";
import { Channel } from "../../models/channel/channel";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen } from "../helpers";
import { InstallationRouter } from "../router";

const CHANNEL_START_GAME_OK = "Start Game";
const CHANNEL_START_GAME_BACK = "Back";
const ERROR_BACK = "Back";

export function channelStartGameRoute(args: {team: Team, channel: Channel}, router: InstallationRouter): void {
  inquirer.prompt([
    {
      choices: [CHANNEL_START_GAME_OK, CHANNEL_START_GAME_BACK],
      message: `Start game in Channel ${args.channel.name}[${args.channel.$key}]?`,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case CHANNEL_START_GAME_OK:
        clearConsole();
        const loadingScreenInterval = loadingScreen();
        args.channel.startGame()
          .then(() => {
            clearInterval(loadingScreenInterval);
            clearConsole();
            router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
          }, (err) => {
            clearInterval(loadingScreenInterval);
            _errorCallback(err.message, args, router);
          });
        break;
      case CHANNEL_START_GAME_BACK:
        clearConsole();
        router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
        break;
      default:
        process.exit(1);
        break;
    }
  });
}

function _errorCallback(message: string, args: {team: Team, channel: Channel}, router: InstallationRouter): void {
  clearConsole();
  inquirer.prompt([
    {
      choices: [ ERROR_BACK ],
      message: "Error occurred: " + message,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case ERROR_BACK:
        clearConsole();
        router.channelRoute({ team: args.team, channelKey: args.channel.$key }, router);
        break;
      default:
        process.exit(1);
        break;
    }
  });
}
