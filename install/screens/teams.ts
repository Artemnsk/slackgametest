import * as inquirer from "inquirer";
import { Team } from "../../models/team/team";
import { clearConsole, loadingScreen } from "../helpers";
import { InstallationRouter } from "../router";

const LIST_EXIT = "Exit";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_EXIT = "Exit";

export function teamsRoute(router: InstallationRouter): void {
  const loadingScreenInterval = loadingScreen();
  Team.getTeams()
    .then((teams) => {
      clearInterval(loadingScreenInterval);
      clearConsole();
      const teamOptions: string[] = [];
      teams.map((team) => {
        teamOptions.push(`${team.name} [${team.getKey()}] ${(team.active ? "ACTIVE" : "NON-ACTIVE")}`);
      });
      teamOptions.push(LIST_EXIT);
      inquirer.prompt([
        {
          choices: teamOptions,
          message: "Slack teams:",
          name: "team",
          type: "list",
        },
      ]).then((answers: {team: string}) => {
        clearConsole();
        if (answers.team === LIST_EXIT) {
          process.exit(0);
        }
        const teamAnswerRegExp = /^.*\[(.*)\].*$/;
        if (!teamAnswerRegExp.test(answers.team)) {
          _errorCallback("Invalid option chosen.", router);
        } else {
          const teamKey = answers.team.replace(teamAnswerRegExp, "$1");
          // Load team screen.
          router.teamRoute({ teamKey }, router);
        }
      });
    }, (error) => {
      clearInterval(loadingScreenInterval);
      _errorCallback(error.message, router);
    });
}

function _errorCallback(message: string, router: InstallationRouter): void {
  clearConsole();
  inquirer.prompt([
    {
      choices: [ERROR_TRY_AGAIN, ERROR_EXIT],
      message: "Error occurred: " + message,
      name: "option",
      type: "list",
    },
  ]).then((answers: {option: string}) => {
    switch (answers.option) {
      case ERROR_TRY_AGAIN:
        router.teamsRoute(router);
        break;
      case ERROR_EXIT:
        process.exit(0);
        break;
    }
  });
}
