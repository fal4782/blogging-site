import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import authMiddleWare from "../middleware/auth";
import {
  createPostInput,
  updatePostInput,
} from "@rahmatdeep/blogging-app-common";

enum ResponseStatus {
  Success = 200,
  NotFound = 404,
  Forbidden = 403,
  ServorError = 500,
  InvalidCredentials = 401,
}

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

postRouter.use("/*", authMiddleWare);

postRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = createPostInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }
  const authorId = c.get("userId");
  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
      select: {
        id: true,
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "Error while creating post" });
  }
});

postRouter.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = updatePostInput.safeParse(body);
  if (!success) {
    c.status(ResponseStatus.InvalidCredentials);
    return c.json({ msg: "Invalid Inputs" });
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({ id: post.id });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Error while updating post" });
  }
});

postRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select: {
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return c.json({ posts });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    return c.json({ msg: "Error while fetching post" });
  }
});

postRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });
    return c.json({ post });
  } catch (e) {
    console.log(e);
    c.status(ResponseStatus.ServorError);
    c.json({ msg: "error while fetching posts" });
  }
});
