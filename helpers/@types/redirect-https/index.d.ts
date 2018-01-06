declare module "redirect-https" {
  import * as express from "express";

  const f: (opts?: object) => (req: express.Request, res: express.Response, next?: express.NextFunction) => void;
  export = f;
}
