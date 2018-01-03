"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer = require("inquirer");
const team_1 = require("../../models/team/team");
const helpers_1 = require("../helpers");
const LIST_EXIT = "Exit";
const ERROR_TRY_AGAIN = "Try Again";
const ERROR_EXIT = "Exit";
function teamsRoute(router) {
    const loadingScreenInterval = helpers_1.loadingScreen();
    team_1.Team.getTeams()
        .then((teams) => {
        clearInterval(loadingScreenInterval);
        helpers_1.clearConsole();
        const teamOptions = [];
        teams.map((team) => {
            teamOptions.push(`${team.name} [${team.$key}] ${(team.active ? "ACTIVE" : "NON-ACTIVE")}`);
        });
        teamOptions.push(LIST_EXIT);
        inquirer.prompt([
            {
                choices: teamOptions,
                message: "Slack teams:",
                name: "team",
                type: "list",
            },
        ]).then((answers) => {
            helpers_1.clearConsole();
            if (answers.team === LIST_EXIT) {
                process.exit(0);
            }
            const teamAnswerRegExp = /^.*\[(.*)\].*$/;
            if (!teamAnswerRegExp.test(answers.team)) {
                _errorCallback("Invalid option chosen.", router);
            }
            else {
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
exports.teamsRoute = teamsRoute;
function _errorCallback(message, router) {
    helpers_1.clearConsole();
    inquirer.prompt([
        {
            choices: [ERROR_TRY_AGAIN, ERROR_EXIT],
            message: "Error occurred: " + message,
            name: "option",
            type: "list",
        },
    ]).then((answers) => {
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
//# sourceMappingURL=teams.js.map