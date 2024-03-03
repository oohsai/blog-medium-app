import { Hono } from "hono";
import { blogRouter } from "./routes/blogRoutes";
import { userRouter } from "./routes/userRoutes";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.route("/api/v1/blog", blogRouter);
app.route("api/v1/user", userRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
