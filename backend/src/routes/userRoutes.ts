import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signUpInput, signinInput } from "@tested-demo/honoapp";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const mysecret = "123";

userRouter.post("/signup", async (c) => {
  const body = await c.req.json();
  const { success } = signUpInput.safeParse(body);
  if (!success) {
    return c.status(411);
  }
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userBody = await prisma.user.create({
      data: {
        username: body.username,
        password: body.password,
      },
    });
    const createToken = await sign({ id: userBody.id }, mysecret);
    return c.text(createToken);
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signinInput.safeParse(body);
  if (!success) {
    return c.status(411);
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: body.username,
      },
    });

    if (!user) {
      return c.json({ c: "Error While Sign-In" });
    }
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    c.json({ jwt });
  } catch (error) {
    return c.json({ error: "Try Again!" });
  }
});
