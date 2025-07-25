export const URL_GENERATOR_SERVICE = "URL_GENERATOR_SERVICE"

export interface IUrlGeneratorService {
  confirmUrl(token: string): string

  unsubscribeUrl(token: string): string
}
