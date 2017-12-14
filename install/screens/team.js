"use strict";

const stdout = process.stdout;
const inquirer = require('inquirer');
const getTeam = require('../../models/team/teams').getTeam;
const helpers = require('../helpers');
const teamEditRoute = require('./teamedit');

const TEAM_EDIT = 'Edit';
const TEAM_CHANNELS = 'View Channels';
const TEAM_BACK = 'Back';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_BACK = 'Back';

module.exports = teamRoute;

/**
 * @typedef {Function} TeamRoute
 * @param {{teamKey: string}} args
 * @param {{teamsRoute: TeamsRoute}} previousRoutes
 */
function teamRoute(args, previousRoutes) {
  var loadingScreen = helpers.loadingScreen();
  getTeam(args.teamKey)
    .then((team) => {
      clearInterval(loadingScreen);
      helpers.clearConsole();
      stdout.write('TEAM INFO\n');
      stdout.write('$key: ' + team.$key + '\n');
      stdout.write('name: ' + team.name + '\n');
      stdout.write('token: ' + team.token + '\n');
      stdout.write('userId: ' + team.userId + '\n');
      stdout.write('botId: ' + team.botId + '\n');
      stdout.write('botToken: ' + team.botToken + '\n');
      stdout.write('active: ' + (team.active === true ? 'true' : 'false') + '\n');
      inquirer.prompt([
        {
          type: 'list',
          name: 'option',
          message: helpers.separator,
          choices: [TEAM_EDIT, TEAM_CHANNELS, TEAM_BACK]
        }
      ]).then((/** {option: string} */ answers) => {
        helpers.clearConsole();
        switch(answers.option) {
          case TEAM_EDIT:
            teamEditRoute({ team }, Object.assign(previousRoutes, { teamRoute }));
            break;
          case TEAM_CHANNELS:
            // TODO:
            break;
          case TEAM_BACK:
            previousRoutes.teamsRoute();
            break;
        }
      });
    }, (error) => {
      clearInterval(loadingScreen);
      _errorCallback(error.message, args, previousRoutes);
    });
}

/**
 *
 * @param {string} message
 * @param {{teamKey: string}} args
 * @param {{teamsRoute: TeamsRoute}} previousRoutes
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
        teamRoute(args, previousRoutes);
        break;
      case ERROR_BACK:
        previousRoutes.teamsRoute();
        break;
    }
  });
}