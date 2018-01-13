import { MixedValuePartial } from "../mixedvaluepartial/mixedvaluepartial";

export abstract class MixedValue<T, IPartial> {
  protected abstract partials: Array<MixedValuePartial & IPartial>;
  protected initialValue: T;
  private finalValue: T|null;

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

  public finalize(): void {
    this.finalValue = this.calculate();
  }

  public addPartial(partial: MixedValuePartial & IPartial): void {
    this.partials.push(partial);
  }
}
