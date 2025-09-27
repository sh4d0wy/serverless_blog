import { Hono } from 'hono'
import {PrismaClient} from "@prisma/client/edge"
import {withAccelerate} from "@prisma/extension-accelerate"
import {hashPassword,verifyPassword} from '../utils/hashPass'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    SALT:string
  }
}>()

app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl:c.env?.DATABASE_URL
  }).$extends(withAccelerate())

  const data = await c.req.json();
  try{
    const passHash = await hashPassword(data.password,"Skbhugra")
    const user = await prisma.user?.create({
      data:{
        email:data.email,
        password:passHash,
      }
    })
    
    c.status(200);
    return c.json("Done")
  }catch(e){
    c.status(500)
    return c.json("Error")
  }
})

app.post('/api/v1/user/signin', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

export default app;
