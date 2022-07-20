export interface ITimeSeriesFilter {
  get(): number;
  update(measurement: number): number;
}
