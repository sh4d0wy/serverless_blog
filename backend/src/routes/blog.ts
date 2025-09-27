import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const blogRouter = new Hono<{
    Bindings:{
        DATABASE_URL:string,
    },
    Variables:{
        userId:string
    }
}>();

blogRouter.post('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    
    const data = await c.req.json();
    try{
        const post = await prisma.posts.create({
            data:{
                title:data.title,
                description:data.description,
                content:data.content,
                authorId:c.get('userId')
            }
        })
        c.status(201)
        return c.json({
            msg:"Post created successfully",
            post
        });
    }catch(err){
        c.status(500)
        return c.json({
            msg:"Error creating post"
        });
    }
});

blogRouter.put('/', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const userId = c.get('userId');
    const data = await c.req.json();
    try{
        const post = await prisma.posts.update({
            where:{
                id:data.id,
                authorId:userId
            },
            data:{
                title:data.title,
                description:data.description,
                content:data.content,
            }
        });
        c.status(200);
        return c.json({
            msg:"Post updated successfully",
            post
        });
    }catch(err){
        c.status(500)
        return c.json({
            msg:"Error updating post"
        });
    }
});

blogRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    try{
        const post = await prisma.posts.findUnique({
        where:{
            id:c.req.param('id')
        }
        })
        c.status(200);
        return c.json(post);
    }catch(err){
        c.status(500)
        return c.json({
            msg:"Post not found"
        });
    }

});

blogRouter.get('/bulk', (c) => {
    const prisma = new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate());
    const posts = prisma.posts.findMany();
    return c.json(posts);
});