import { InvalidValueError } from "../errors/invalid-value.error";
import { IJsonDeserializable } from "../interfaces/json-deserializable.interface";
import { IJsonSerializable } from "../interfaces/json-serializable.interface";
import { ITimeSeriesFilter } from "./filter.interface";

export class SimpleKalmanFilter
  implements ITimeSeriesFilter, IJsonSerializable, IJsonDeserializable
{
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

  fromJson(json: string): void {
    try {
      const parsed = JSON.parse(json);
      const isPredictedEstimateValid =
        typeof parsed.predictedEstimate === "number" &&
        !isNaN(parsed.predictedEstimate);
      const isPredictedUncertaintyValid =
        typeof parsed.predictedUncertainty === "number" &&
        !isNaN(parsed.predictedUncertainty);
      const isEstimateValid =
        typeof parsed.estimate === "number" && !isNaN(parsed.estimate);
      const isGainValid =
        typeof parsed.gain === "number" && !isNaN(parsed.gain);
      const isEstimateUncertaintyValid =
        typeof parsed.estimateUncertainty === "number" &&
        !isNaN(parsed.estimateUncertainty);
      const isProcessNoiseValid =
        typeof parsed.processNoise === "number" && !isNaN(parsed.processNoise);
      const isMeasurementNoiseValid =
        typeof parsed.measurementNoise === "number" &&
        !isNaN(parsed.measurementNoise);

      if (
        isPredictedEstimateValid &&
        isPredictedUncertaintyValid &&
        isEstimateValid &&
        isGainValid &&
        isEstimateUncertaintyValid &&
        isProcessNoiseValid &&
        isMeasurementNoiseValid
      ) {
        Object.assign(this, parsed);
      } else {
        throw new InvalidValueError();
      }
    } catch (ex) {
      throw new InvalidValueError(
        "Invalid serialized simple kalman filter value is provided to fromJson"
      );
    }
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
