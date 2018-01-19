export abstract class MixedValuePartial<T> {
  protected value: T;
  private owner: object;

  constructor(value: T, owner: object) {
    this.owner = owner;
    this.value = value;
  }

  public getOwner(): object {
    return this.owner;
  }
}
