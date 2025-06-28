export const ClientRoutesConsts = {
  confirm: (token: string) => `/confirm/${token}`,
  unsubscribe: (token: string) => `/unsubscribe/${token}`
}
