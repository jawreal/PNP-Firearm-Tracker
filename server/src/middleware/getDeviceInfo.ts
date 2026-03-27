import { Request, Response, NextFunction } from "express";
import { UAParser } from "ua-parser-js";

const getDeviceInfo = (req: Request, _: Response, next: NextFunction) => {
  const raw =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    req.ip ??
    "Unknown";

  // Normalize IPv6 loopback to IPv4
  const ip = raw === "::1" ? "127.0.0.1" : raw;
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
