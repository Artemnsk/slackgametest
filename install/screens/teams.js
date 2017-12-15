"use strict";

const inquirer = require('inquirer');
const getTeams = require('../../models/team/teams').getTeams;
const helpers = require('../helpers');

const LIST_EXIT = 'Exit';
const ERROR_TRY_AGAIN = 'Try Again';
const ERROR_EXIT = 'Exit';

module.exports = teamsRoute;

/**
 * @typedef {Function} TeamsRoute
 * @param {InstallationRouter} router
 */
function teamsRoute(router) {
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
          _errorCallback('Invalid option chosen.', router);
        } else {
          let teamKey = answers.team.replace(teamAnswerRegExp, '$1');
          // Load team screen.
          router.teamRoute({ teamKey }, router);
        }
      });
    }, (error) => {
      clearInterval(loadingScreen);
      _errorCallback(error.message, router);
    });
}

/**
 *
 * @param {string} message
 * @param {InstallationRouter} router
 */
function _errorCallback(message, router) {
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
        router.teamsRoute(router);
        break;
      case ERROR_EXIT:
        process.exit(0);
        break;
    }
  });
}