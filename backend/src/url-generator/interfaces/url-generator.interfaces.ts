export interface GeneratedUrl {
  url: string
  params: Record<string, string | number | boolean>
}

export interface IUrlGeneratorService {
  confirmUrl(token: string): GeneratedUrl

  unsubscribeUrl(token: string): GeneratedUrl
}
