export interface ListItem {
  id: string;
}

export interface ElementList<T> {
  list: T[];
  count: number | null;
}
