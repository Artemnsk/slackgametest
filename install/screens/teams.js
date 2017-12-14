"use strict";

const inquirer = require('inquirer');
const getTeams = require('../../models/team/teams').getTeams;
const teamRoute = require('./team');
const helpers = require('../helpers');

const LIST_EXIT = 'Exit';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_EXIT = 'Exit';

module.exports = teamsRoute;

/**
 * @typedef {Function} TeamsRoute
 */
function teamsRoute() {
  var loadingScreen = helpers.loadingScreen();
  getTeams()
    .then((teams) => {
      clearInterval(loadingScreen);
      helpers.clearConsole();
      var teamOptions = [];
      teams.map((team) => {
        teamOptions.push(team.name + ' [' + team.$key + '] ' + (team.active ? 'ACTIVE' : 'NON-ACTIVE'));
      });
      teamOptions.push(LIST_EXIT);
      inquirer.prompt([
        {
          type: 'list',
          name: 'team',
          message: 'Slack teams:',
          choices: teamOptions
        }
      ]).then((/** {team: string} */ answers) => {
        helpers.clearConsole();
        if (answers.team === LIST_EXIT) {
          process.exit(0);
        }
        let teamAnswerRegExp = /^.*\[(.*)\].*$/;
        if (!teamAnswerRegExp.test(answers.team)) {
          _errorCallback('Invalid option chosen.');
        } else {
          let teamKey = answers.team.replace(teamAnswerRegExp, '$1');
          // Load team screen.
          teamRoute({ teamKey }, { teamsRoute });
        }
      });
    }, (error) => {
      clearInterval(loadingScreen);
      _errorCallback(error.message);
    });
}

/**
 *
 * @param {string} message
 * @private
 */
function _errorCallback(message) {
  helpers.clearConsole();
  inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: "Error occurred: " + message,
      choices: [ERROR_TRY_AGAIN, ERROR_EXIT]
    }
  ]).then((/** {option: string} */ answers) => {
    switch(answers.option) {
      case ERROR_TRY_AGAIN:
        return teamsRoute();
        break;
      case ERROR_EXIT:
        process.exit(0);
        break;
    }
  });
}