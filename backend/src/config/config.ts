import { ConfigModuleOptions } from "@nestjs/config"
import * as process from "node:process"

const getEnvFilePath = (env: string | undefined) => {
  if (env === "test") {
    return "../.env.test"
  } else if (env === "development") {
    return "../.env.dev"
  }

  return "../.env"
}

export const config: ConfigModuleOptions = {
  envFilePath: getEnvFilePath(process.env.NODE_ENV),
  isGlobal: true
}
