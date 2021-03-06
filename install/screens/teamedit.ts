import * as inquirer from "inquirer";
import * as Slack from "slack-node";
import { SlackUsersListRequest, SlackUsersListResponse } from "../../helpers/slackapicalls";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen, separator } from "../helpers";
import { InstallationRouter } from "../router";

const stdout = process.stdout;
const TEAM_EDIT_SAVE = "Save";
const TEAM_EDIT_CANCEL = "Cancel";
const TEAM_ACTIVE_TRUE = "true";
const TEAM_ACTIVE_FALSE = "false";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";

export function teamEditRoute(args: {team: Team}, router: InstallationRouter): void {
  clearConsole();
  if (args.team.token !== undefined) {
    const loadingScreenInterval = loadingScreen();
    const slack = new Slack(args.team.token);
    // Get users list from Slack team.
    const apiCallArgs: SlackUsersListRequest = {
      include_locale: false,
      limit: 0,
      presence: false,
    };
    slack.api("users.list", apiCallArgs, (err, response: SlackUsersListResponse) => {
      clearInterval(loadingScreenInterval);
      if (err) {
        _errorCallback(err.error.message, args, router);
      } else if (response.ok === true) {
        let adminDefaultOption;
        const slackUserOptions = response.members.map((member) => {
          const optionName = `${member.profile.real_name} [${member.id}]`;
          if (member.id === args.team.admin) {
            adminDefaultOption = optionName;
          }
          return optionName;
        });
        stdout.write("TEAM INFO\n");
        stdout.write(`$key: ${args.team.getKey()}\n`);
        stdout.write(`name: ${args.team.name}\n`);
        stdout.write(`token: ${args.team.token}\n`);
        stdout.write(`userId: ${args.team.userId}\n`);
        stdout.write(`botId: ${args.team.botId}\n`);
        stdout.write(`botToken: ${args.team.botToken}\n`);
        inquirer.prompt([
          {
            choices: slackUserOptions,
            default: adminDefaultOption,
            message: "Admin user:",
            name: "admin",
            paginated: true,
            type: "list",
          },
          {
            choices: [TEAM_ACTIVE_TRUE, TEAM_ACTIVE_FALSE],
            default: args.team.active === true ? TEAM_ACTIVE_TRUE : TEAM_ACTIVE_FALSE,
            message: "active",
            name: "active",
            type: "list",
          }, {
            choices: [TEAM_EDIT_SAVE, TEAM_EDIT_CANCEL],
            message: separator,
            name: "option",
            type: "list",
          },
        ]).then((answers: {active: string, option: string, admin: string}) => {
          clearConsole();
          switch (answers.option) {
            case TEAM_EDIT_SAVE:
              const teamFirebaseValues = args.team.getFirebaseValue();
              // Retrieve admin value.
              const admin = answers.admin.replace(/^.*\[(.*)\]$/i, "$1");
              teamFirebaseValues.admin = admin;
              const active = answers.active === TEAM_ACTIVE_TRUE;
              teamFirebaseValues.active = active;
              const loadingScreenInterval = loadingScreen();
              Team.setTeam(teamFirebaseValues, args.team.getKey())
                .then(() => {
                  clearInterval(loadingScreenInterval);
                  clearConsole();
                  router.teamRoute({ teamKey: args.team.getKey() }, router);
                }, (error) => {
                  clearInterval(loadingScreenInterval);
                  _errorCallback(error.message, args, router);
                });
              break;
            case TEAM_EDIT_CANCEL:
              router.teamRoute({ teamKey: args.team.getKey() }, router);
              break;
          }
        });
      } else {
        _errorCallback(`Something went wrong during Slack users.list API call: ${response.error}`, args, router);
      }
    });
  } else {
    _errorCallback("Slack API token is not set for this team.", args, router);
  }
}

function _errorCallback(message: string, args: {team: Team}, router: InstallationRouter): void {
  clearConsole();
  inquirer.prompt([
    {
      choices: [ERROR_TRY_AGAIN, ERROR_BACK],
      message: `Error occurred: ${message}`,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case ERROR_TRY_AGAIN:
        router.teamEditRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamRoute({ teamKey: args.team.getKey() }, router);
        break;
    }
  });
}
