import { Request, Response, NextFunction } from "express";
import { UAParser } from "ua-parser-js";

const getDeviceInfo = (req: Request, _: Response, next: NextFunction) => {
  const ip = req.ip ?? "Uknown";
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  req.audit = {
    ip,
    browser: ua.browser.name,
    os: ua.os.name,
    device: ua.device.type || "desktop",
  };

  next();
};

export default getDeviceInfo;
