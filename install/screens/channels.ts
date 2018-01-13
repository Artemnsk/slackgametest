import * as inquirer from "inquirer";
import { Channel } from "../../models/channel/channel";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen } from "../helpers";
import { InstallationRouter } from "../router";

const LIST_BACK = "Back";
const NEW_CHANNEL = "Create new channel";
const ERROR_TRY_AGAIN = "Try again";
const ERROR_BACK = "Back";

export function channelsRoute(args: {team: Team}, router: InstallationRouter): void {
  const loadingScreenInterval = loadingScreen();
  Channel.getChannels(args.team, true)
    .then((channels) => {
      clearInterval(loadingScreenInterval);
      clearConsole();
      const channelOptions: Array<object|string> = [];
      if (channels.length === 0) {
        channelOptions.push({
          disabled: "Create new game channel using option below",
          name: "This team has no active channels with game run.",
        });
      } else {
        channels.map((channel) => {
          channelOptions.push(`${channel.name} [${channel.getKey()}] ${channel.active ? "ACTIVE" : "NON-ACTIVE"}`);
        });
      }
      channelOptions.push(new inquirer.Separator());
      channelOptions.push(NEW_CHANNEL);
      channelOptions.push(LIST_BACK);
      inquirer.prompt([
        {
          choices: channelOptions,
          message: `${args.team.name} team channels:`,
          name: "channel",
          type: "list",
        },
      ]).then((answers: {channel: string}) => {
        clearConsole();
        switch (answers.channel) {
          case NEW_CHANNEL:
            router.channelCreateRoute(args, router);
            break;
          case LIST_BACK:
            router.teamRoute({ teamKey: args.team.getKey() }, router);
            break;
          default:
            // We suppose some channel being chosen.
            const channelAnswerRegExp = /^.*\[(.*)\].*$/;
            if (!channelAnswerRegExp.test(answers.channel)) {
              _errorCallback("Invalid option chosen.", args, router);
            } else {
              const channelKey = answers.channel.replace(channelAnswerRegExp, "$1");
              // Load channel screen.
              router.channelRoute({ team: args.team, channelKey }, router);
            }
            break;
        }
      });
    }, (error) => {
      clearInterval(loadingScreenInterval);
      _errorCallback(error.message, args, router);
    });
}

function _errorCallback(message: string, args: {team: Team}, router: InstallationRouter): void {
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
        router.channelsRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamRoute({ teamKey: args.team.getKey() }, router);
        break;
    }
  });
}
