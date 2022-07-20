import {  SimpleKalmanFilter } from './simple-kalman-filter';

describe('Simple Kalman Filter', () => {
  it('Should be serializable to JSON', () => {
    const kf = new SimpleKalmanFilter(0, 1000, 0.0625, 1.4);
    const parsed = JSON.parse(kf.toJson());

    expect(parsed.gain).toBe(0);
    expect(parsed.predictedEstimate).toBe(parsed.estimate);
    expect(parsed.estimate).toBe(0);
    expect(parsed.estimateUncertainty).toBe(1000);
    expect(parsed.predictedUncertainty).toBe(parsed.estimateUncertainty);
    expect(parsed.processNoise).toBe(0.0625);
    expect(parsed.measurementNoise).toBe(1.4);
  });

  it('Should be deserializable from json', () => {
    const kf = new SimpleKalmanFilter(0, 1000, 0.0625, 1.4);
    const serialized = kf.toJson();

    const kf2 = new SimpleKalmanFilter(0, 1000, 0.1, 0.1);
    expect(() => kf2.fromJson(serialized)).not.toThrow();

    expect(kf2).toStrictEqual(kf);
  });
});
