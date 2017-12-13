"use strict";

const stdin = process.stdin;
const stdout = process.stdout;
const inquirer = require('inquirer');
const getTeams = require('../models/team/teams').getTeams;

function clearConsole() {
  stdout.write('\x1Bc');
}

function loadingScreen() {
  clearConsole();
  stdout.write('Loading');
  return setInterval(() => {
    stdout.write('.');
  }, 200);
}

clearConsole();
var loadingScreen = loadingScreen();
getTeams(true)
  .then((teams) => {
    clearInterval(loadingScreen);
    clearConsole();
    var teamOptions = [];
    teamOptions.push('Exit');
    teams.map((team) => {
      teamOptions.push(team.name + ' [' + team.$key + ']');
    });
    inquirer.prompt([
      {
        type: 'list',
        name: 'team',
        message: 'Active Slack teams:',
        choices: teamOptions
      }
    ]).then((/** {team: string} */ answers) => {
      clearConsole();
      let teamAnswerRegExp = /^.*\[(.*)\]$/;
      if (!teamAnswerRegExp.test(answers.team)) {
        process.exit(0);
      }
      let teamKey = answers.team.replace(teamAnswerRegExp, '$1');
    });
  });