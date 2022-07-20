import { InvalidValueError } from "../errors/invalid-value.error";
import { IJsonDeserializable } from "../interfaces/json-deserializable.interface";
import { IJsonSerializable } from "../interfaces/json-serializable.interface";
import { ITimeSeriesFilter } from "./filter.interface";

export class MovingAverage
  implements ITimeSeriesFilter, IJsonSerializable, IJsonDeserializable
{
  private data: number[] = [];
  private initialized: boolean = false;
  private p: number = 0;
  private sum: number = 0;
  private numOfSamples: number = 0;

  constructor(n: number, defaultValue?: number) {
    this.numOfSamples = n;
    if (typeof defaultValue === "number") {
      this.initialize(defaultValue);
    }
  }

  fromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);

      const isDataValid = Array.isArray(parsed.data);
      const isInitializedValid = typeof parsed.initialized === "boolean";
      const isPValid = typeof parsed.p === "number" && !isNaN(parsed.p);
      const isSumValid =
        typeof parsed.sum === "number" && !isNaN(parsed.sum) && parsed.sum >= 0;
      const isNumOfSamplesValid =
        typeof parsed.numOfSamples === "number" &&
        !isNaN(parsed.numOfSamples) &&
        parsed.numOfSamples > 0;

      if (
        isDataValid &&
        isInitializedValid &&
        isPValid &&
        isSumValid &&
        isNumOfSamplesValid
      ) {
        Object.assign(this, parsed);
      } else {
        throw new Error("Invalid values");
      }
    } catch (ex) {
      throw new InvalidValueError("Invalid serialized moving average filter");
    }
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  private initialize(value: number) {
    this.data = [];
    for (let i = 0; i < this.numOfSamples; i++) {
      this.data.push(value);
    }

    this.sum = this.data.reduce((prev, current) => prev + current, 0);
    this.initialized = true;
  }

  update(measurement: number): number {
    if (this.initialized === false) {
      this.initialize(measurement);
    }

    this.data[this.p++] = measurement;
    this.sum = this.data.reduce((prev, current) => prev + current, 0);

    if (this.p >= this.numOfSamples) {
      this.p = 0;
    }

    return this.get();
  }

  get() {
    return this.sum / this.numOfSamples;
  }
}
