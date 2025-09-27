import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';
import { basicAuth } from './middleware/basicAuth';

type Variables={
    userId:string;
}
const app = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        SALT: string;
    };
    Variables: Variables
}>();


app.use('/api/v1/blog/*', basicAuth);

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog",blogRouter);


export default app;
