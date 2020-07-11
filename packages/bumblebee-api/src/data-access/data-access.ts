import { Document } from "mongoose";

abstract class DataAccess<T, D extends Document> {
  public abstract readonly create: (data: T) => Promise<D>;
  public abstract readonly deleteById: (id: string) => Promise<void>;
  public abstract readonly deleteWhere: (condition: (value: D) => boolean) => Promise<void>;
  public abstract readonly getAll: () => Promise<Array<D>>;
  public abstract readonly getById: (id: string) => Promise<D>;
  public abstract readonly getWhere: (condition: (value: D) => boolean) => Promise<Array<D>>;
  public abstract readonly updateById: (id: string, data: T) => Promise<D>;
}

export default DataAccess;
