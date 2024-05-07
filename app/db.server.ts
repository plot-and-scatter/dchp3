import type { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { prefixImageUrls } from "./services/controllers/image/prefixImageUrls"

let prisma: PrismaClient

declare global {
  var __db__: PrismaClient
}

const imagePathPrefixMiddleware: Prisma.Middleware = async (params, next) => {
  if (
    (params.model === "Image" || params.args?.include?.images) &&
    params.action?.startsWith("find")
  ) {
    const result = await next(params)
    prefixImageUrls(result)
    return result
  } else {
    return next(params)
  }
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()

  prisma.$use(imagePathPrefixMiddleware)
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient({ log: ["query"] })

    global.__db__.$use(imagePathPrefixMiddleware)

    // For fuller logging, use these lines instead
    // global.__db__ = new PrismaClient({ log: ["query"] })
    // global.__db__.$on("query" as any, async (e: any) => {
    //   console.log(e.params)
    // })
  }
  prisma = global.__db__

  prisma.$connect()
}

export { prisma }
