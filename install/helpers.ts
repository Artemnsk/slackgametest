const stdout = process.stdout;

export const separator = "------------------------------";

export function clearConsole() {
  stdout.write("\x1Bc");
}

export function loadingScreen() {
  stdout.write("Loading");
  return setInterval(() => {
    stdout.write(".");
  }, 200);
}
