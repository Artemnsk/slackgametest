import * as express from "express";
import * as greenlockExpress from "greenlock-express";
import * as http from "http";
import * as https from "https";
import * as redirectHttps from "redirect-https";
import { router as rootRoute } from "./controllers";
import { credentials as publicCredentials } from "./credentials/public";

const app = express();
// Start game.
// const startGame = require('./gameloop/game');
// startGame();
// const randomizer = require('./gameloop/actionsrandomizer');
// randomizer(1600);
app.use("/slacktestgame", rootRoute);

if (publicCredentials.useSSL) {
  const letsEncryptGateway = "https://acme-v01.api.letsencrypt.org/directory";
  const lex = greenlockExpress.create({
    agreeTos: true,
    approveDomains: (opts, certs, cb) => {
      if (certs) {
        opts.domains = certs.altnames;
        // console.log(certs.altnames);
      } else {
        opts.email = "shelkov1991@gmail.com";
        opts.agreeTos = true;
        opts.domains = ["artemnsk.com"];
      }
      cb(null, {options: opts, certs});
    },
    challenges: {
      "http-01": require("le-challenge-fs").create({
          webrootPath: "~/letsencrypt/var/acme-challenges",
      }),
    },
    server: letsEncryptGateway,
    store: require("le-store-certbot").create({
      certPath: ":configDir/:hostname/cert.pem",
      chainPath: ":configDir/:hostname/chain.pem",
      configDir: "~/letsencrypt/etc",
      debug: true,
      fullchainPath: ":configDir/:hostname/fullchain.pem",
      logsDir: "~/letsencrypt/var/log",
      privkeyPath: ":configDir/:hostname/privkey.pem",
      webrootPath: "~/letsencrypt/srv/www/:hostname/.well-known/acme-challenge",
      workDir: "~/letsencrypt/var/lib",
    }),
  });

  http.createServer(lex.middleware(redirectHttps())).listen(80, () => {
    // console.log("Listening for ACME http-01 challenges on", this.address());
  });

  https.createServer(lex.httpsOptions, lex.middleware(app)).listen(443, () => {
    // console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
  });
} else {
  app.listen(8080, () => {
    // console.log("Listening on ", this.address());
  });
}
