export interface IHandler {
  setNext(handler: IHandler): IHandler
}
