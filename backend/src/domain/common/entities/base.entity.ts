export class BaseEntity {
  constructor(protected _id: string | null) {}

  get id() {
    return this._id
  }
}
