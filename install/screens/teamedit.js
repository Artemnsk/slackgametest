"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const setTeam = require('../../models/team/teams').setTeam;
const helpers = require('../helpers');

const TEAM_EDIT_SAVE = 'Save';
const TEAM_EDIT_CANCEL = 'Cancel';
const TEAM_ACTIVE_TRUE = 'true';
const TEAM_ACTIVE_FALSE = 'false';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_BACK = 'Back';

module.exports = teamEditRoute;

/**
 *
 * @param {{team: Team}} args
 * @param {{teamsRoute: TeamsRoute, teamRoute: TeamRoute}} previousRoutes
 */
function teamEditRoute(args, previousRoutes) {
  helpers.clearConsole();
  stdout.write('TEAM INFO\n');
  stdout.write('$key: ' + args.team.$key + '\n');
  stdout.write('name: ' + args.team.name + '\n');
  stdout.write('token: ' + args.team.token + '\n');
  stdout.write('userId: ' + args.team.userId + '\n');
  stdout.write('botId: ' + args.team.botId + '\n');
  stdout.write('botToken: ' + args.team.botToken + '\n');
  inquirer.prompt([
    {
      type: 'list',
      name: 'active',
      message: 'active',
      default: args.team.active === true ? TEAM_ACTIVE_TRUE : TEAM_ACTIVE_FALSE,
      choices: [TEAM_ACTIVE_TRUE, TEAM_ACTIVE_FALSE]
    }, {
      type: 'list',
      name: 'option',
      message: helpers.separator,
      choices: [TEAM_EDIT_SAVE, TEAM_EDIT_CANCEL]
    }
  ]).then((/** {active: string, option: string} */ answers) => {
    helpers.clearConsole();
    switch(answers.option) {
      case TEAM_EDIT_SAVE:
        let teamFirebaseValues = args.team.getFirebaseValue();
        let active = answers.active === TEAM_ACTIVE_TRUE;
        teamFirebaseValues.active = active;
        var loadingScreen = helpers.loadingScreen();
        setTeam(teamFirebaseValues, args.team.$key)
          .then(() => {
            clearInterval(loadingScreen);
            helpers.clearConsole();
            previousRoutes.teamRoute({ teamKey: args.team.$key }, { teamsRoute: previousRoutes.teamsRoute });
          }, (error) => {
            clearInterval(loadingScreen);
            _errorCallback(error.message, args, previousRoutes);
          });
        break;
      case TEAM_EDIT_CANCEL:
        previousRoutes.teamRoute({ teamKey: args.team.$key }, { teamsRoute: previousRoutes.teamsRoute });
        break;
    }
  });


}

/**
 *
 * @param {string} message
 * @param {{team: Team}} args
 * @param {{teamsRoute: TeamsRoute, teamRoute: TeamRoute}} previousRoutes
 * @private
 */
function _errorCallback(message, args, previousRoutes) {
  helpers.clearConsole();
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: "Error occurred: " + message,
      choices: [ERROR_TRY_AGAIN, ERROR_BACK]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case ERROR_TRY_AGAIN:
        teamEditRoute(args, previousRoutes);
        break;
      case ERROR_BACK:
        previousRoutes.teamRoute({ teamKey: args.team.$key }, { teamsRoute: previousRoutes.teamsRoute });
        break;
    }
  });
}