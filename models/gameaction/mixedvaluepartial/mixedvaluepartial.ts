export abstract class MixedValuePartial {
  protected abstract value: any;
  // TODO: some "calculatable"?
  private owner: object;

  constructor(value: any, owner: object) {
    this.owner = owner;
    this.value = value;
  }

  public getOwner(): object {
    return {};
  }
}
