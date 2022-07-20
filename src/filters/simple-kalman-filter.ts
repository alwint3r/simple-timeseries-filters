import { IJsonSerializable } from "../interfaces/json-serializable.interface";
import { ITimeSeriesFilter } from "./filter.interface";

export class SimpleKalmanFilter implements ITimeSeriesFilter, IJsonSerializable {
  private predictedEstimate: number;
  private predictedUncertainty: number;
  private gain: number;

  constructor(
    private estimate: number,
    private estimateUncertainty: number,
    private processNoise: number,
    private measurementNoise: number
  ) {
    this.predictedEstimate = estimate;
    this.predictedUncertainty = estimateUncertainty;
    this.gain = 0;
  }

  toJson(): string {
    return JSON.stringify(this);
  }

  update(measurement: number): number {
    this.gain =
      this.predictedUncertainty /
      (this.predictedUncertainty + this.measurementNoise);
    this.estimate =
      this.predictedEstimate +
      this.gain * (measurement - this.predictedEstimate);
    this.estimateUncertainty = (1 - this.gain) * this.estimateUncertainty;

    this.predictedEstimate = this.estimate;
    this.predictedUncertainty = this.estimateUncertainty + this.processNoise;

    return this.get();
  }

  get(): number {
    return this.estimate;
  }
}
