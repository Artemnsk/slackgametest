"use strict";

const stdout = process.stdout;
const separator = "------------------------------";

module.exports = {
  clearConsole,
  loadingScreen,
  separator
};

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