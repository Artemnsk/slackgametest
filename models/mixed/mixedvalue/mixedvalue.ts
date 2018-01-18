import { MixedValuePartial } from "../mixedvaluepartial/mixedvaluepartial";

export abstract class MixedValue<T, IPartial> {
  protected abstract partials: Array<MixedValuePartial & IPartial>;
  protected initialValue: T;
  private finalValue: T|null;

  constructor(initialValue: T) {
    this.partials = [];
    this.initialValue = initialValue;
    this.finalValue = null;
  }

  public abstract calculate(): T;

  public isFinal(): boolean {
    return this.finalValue !== null;
  }

  public getInitialValue(): T {
    return this.initialValue;
  }

  public getFinalValue(): T|null {
    return this.finalValue;
  }

  public finalize(): T {
    this.finalValue = this.calculate();
    return this.finalValue;
  }

  public addPartial(partial: MixedValuePartial & IPartial): void {
    this.partials.push(partial);
  }
}
