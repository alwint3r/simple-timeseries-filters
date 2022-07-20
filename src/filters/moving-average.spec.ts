import { MovingAverage } from './moving-average';

describe('Moving Average', () => {
  it('Should be serializable to JSON', () => {
    const ma = new MovingAverage(10, 20);
    const parsed = JSON.parse(ma.toJson());

    expect(parsed.data.length).toBe(10);
    expect(parsed.data).toStrictEqual(new Array(10).fill(20));
    expect(parsed.initialized).toBe(true);
    expect(parsed.p).toBe(0);
    expect(parsed.sum).toBe(200);
    expect(parsed.numOfSamples).toBe(10);
  });
});