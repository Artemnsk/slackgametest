"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stdout = process.stdout;
exports.separator = "------------------------------";
function clearConsole() {
    stdout.write("\x1Bc");
}
exports.clearConsole = clearConsole;
function loadingScreen() {
    stdout.write("Loading");
    return setInterval(() => {
        stdout.write(".");
    }, 200);
}
exports.loadingScreen = loadingScreen;
//# sourceMappingURL=helpers.js.map