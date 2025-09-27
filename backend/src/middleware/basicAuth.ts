import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const basicAuth = createMiddleware(async (c, next) => {
    const data = c.req.header('Authorization');
    const token = data?.split(' ')[1] || '';

    const decodedToken = await verify(token, c.env?.SALT);
    const id = decodedToken.id as string;
    c.set('userId', id);
    await next();
})