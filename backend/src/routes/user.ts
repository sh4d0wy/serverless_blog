import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { hashPassword, verifyPassword } from "../../utils/hashPass";
import { sign } from "hono/jwt";
import { signupInput } from "@skbhugra/blog_common";

export const userRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        SALT:string
    }
}>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
    
    const rawData = await c.req.json();
    const {success,data} = signupInput.safeParse(rawData);
    if(!success){
        c.status(403);
        return c.json({
            error: 'Invalid input',
            data
        });
    }
    try {
        const userExists = await prisma.user?.findUnique({
            where: {
                email: data.email,
            },
        });
        if (userExists) {
            c.status(403);
            return c.json({
                error: 'User already exists',
            });
        } else {
            const passHash = await hashPassword(data.password, c.env?.SALT);
            const user = await prisma.user?.create({
                data: {
                    email: data.email,
                    password: passHash,
                },
            });
            const token = await sign(
                {
                    id: user?.id,
                    email: user?.email,
                },
                c.env?.SALT
            );

            c.status(200);
            return c.json({
                msg: 'User created successfully',
                token: `Bearer ${token}`,
            });
        }
    } catch (e) {
        c.status(403);
        return c.json({
            error: 'Error while signing up',
        });
    }
});

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const data = await c.req.json();
    const {success,data:parsedData} = signupInput.safeParse(data);
    if(!success){
        c.status(403);
        return c.json({
            error: 'Invalid input',
            data:parsedData
        });
    }
    const userExists = await prisma.user?.findUnique({
        where: {
            email: parsedData.email,
        },
        select: { id: true, email: true, password: true },
    });
    if (userExists) {
        const isPasswordValid = await verifyPassword(parsedData.password, c.env?.SALT, userExists.password);
        if (!isPasswordValid) {
            c.status(403);
            return c.json({
                error: 'Invalid password',
            });
        }
        const token = await sign(
            {
                id: userExists?.id,
                email: userExists?.email,
            },
            c.env?.SALT
        );

        c.status(200);
        return c.json({
            msg: 'User Logged in successfully',
            token: `Bearer ${token}`,
        });
    } else {
        c.status(403);
        return c.json({
            error: 'User does not exist',
        });
    }
});