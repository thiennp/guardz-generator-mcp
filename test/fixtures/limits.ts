export type Lookup<T> = T extends string ? string[] : number;

export interface Bag {
  value: any;
}
