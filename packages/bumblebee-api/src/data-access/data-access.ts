import { Document } from "mongoose";

abstract class DataAccess<T, D extends Document> {
  public abstract readonly create: (data: T, userId: string) => Promise<D>;
  public abstract readonly deleteById: (id: string, userId: string) => Promise<void>;
  public abstract readonly deleteWhere: (condition: (value: D) => boolean, userId: string) => Promise<void>;
  public abstract readonly getAll: (userId: string) => Promise<Array<D>>;
  public abstract readonly getById: (id: string, userId: string) => Promise<D>;
  public abstract readonly getWhere: (condition: (err: any, value: D) => boolean, userId: string) => Promise<Array<D>>;
  public abstract readonly updateById: (id: string, data: T, userId: string) => Promise<D>;
}

export default DataAccess;
