import * as inquirer from "inquirer";
import * as Slack from "slack-node";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen, separator } from "../helpers";
import { InstallationRouter } from "../router";

const stdout = process.stdout;
const TEAM_EDIT = "Edit";
const TEAM_CHANNELS = "View Channels";
const TEAM_BACK = "Back";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_BACK = "Back";

export function teamRoute(args: {teamKey: string}, router: InstallationRouter): void {
  const loadingScreenInterval = loadingScreen();
  Team.getTeam(args.teamKey)
    .then((team) => {
      if (team !== null) {
        if (team.admin) {
          const apiCallArgs = {
            // TODO:
            include_locale: false,
            user: team.admin,
          };
          const slack = new Slack(team.token);
          slack.api("users.info", apiCallArgs, (err, /** SlackUserInfoResponse */ response) => {
            if (err || response.ok !== true) {
              clearInterval(loadingScreenInterval);
              clearConsole();
              teamViewPart(args, router, team, `${team.admin} ERROR: ${err ? err.error : "MAYBE THIS USER DOESN'T EXIST ANYMORE"}`);
            } else if (response.ok === true) {
              clearInterval(loadingScreenInterval);
              clearConsole();
              teamViewPart(args, router, team, `${response.user.profile.real_name} [${response.user.id}]`);
            }
          });
        } else {
          clearInterval(loadingScreenInterval);
          clearConsole();
          teamViewPart(args, router, team, "WARNING! NOT SET!");
        }
      } else {
        clearInterval(loadingScreenInterval);
        _errorCallback(`No team found by key ${args.teamKey}`, args, router);
      }
    }, (error) => {
      clearInterval(loadingScreenInterval);
      _errorCallback(error.message, args, router);
    });
}

function teamViewPart(args: {teamKey: string}, router: InstallationRouter, team: Team, teamAdminLabel: string): void {
  stdout.write("TEAM INFO\n");
  stdout.write("$key: " + team.$key + "\n");
  stdout.write("name: " + team.name + "\n");
  stdout.write("token: " + team.token + "\n");
  stdout.write("userId: " + team.userId + "\n");
  stdout.write("botId: " + team.botId + "\n");
  stdout.write("botToken: " + team.botToken + "\n");
  stdout.write("admin: " + teamAdminLabel + "\n");
  stdout.write("active: " + (team.active === true ? "true" : "false") + "\n");
  const choices = team.admin ? [TEAM_EDIT, TEAM_CHANNELS, TEAM_BACK] : [TEAM_EDIT, { name: TEAM_CHANNELS, disabled: "Set app admin for this Slack team first."}, TEAM_BACK];
  inquirer.prompt([
    {
      choices,
      message: separator,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    clearConsole();
    switch (answers.option) {
      case TEAM_EDIT:
        router.teamEditRoute({ team }, router);
        break;
      case TEAM_CHANNELS:
        router.channelsRoute({ team }, router);
        break;
      case TEAM_BACK:
        router.teamsRoute(router);
        break;
    }
  });
}

function _errorCallback(message: string, args: {teamKey: string}, router: InstallationRouter): void {
  clearConsole();
  inquirer.prompt([
    {
      choices: [ERROR_TRY_AGAIN, ERROR_BACK],
      message: "Error occurred: " + message,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case ERROR_TRY_AGAIN:
        router.teamRoute(args, router);
        break;
      case ERROR_BACK:
        router.teamsRoute(router);
        break;
    }
  });
}
