import { Context, Next } from "hono";
import { verify } from "hono/jwt";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  AlreadyExsists = 403,
  ServorError = 500,
  UnAuthorized = 401,
}

export default async function authMiddleWare(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  console.log("hit");

  if (!authHeader) {
    c.status(ResponseStatus.UnAuthorized);
    return c.json({ msg: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.id);
    await next();
  } catch (e) {
    c.status(ResponseStatus.UnAuthorized);
    return c.json({ msg: "Access Denied" });
  }
}
