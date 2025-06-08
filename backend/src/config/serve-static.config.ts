import { join } from "path"
import { ServeStaticModule } from "@nestjs/serve-static"
import * as process from "node:process"

export const dynamicServeStatic = () => {
  if (process.env.NODE_ENV === "production") {
    return [
      ServeStaticModule.forRoot({
        rootPath: join(
          __dirname,
          "..",
          "..",
          "..",
          "..",
          "frontend",
          "dist",
          "frontend",
          "browser"
        ),
        useGlobalPrefix: false
      })
    ]
  }
  return []
}
