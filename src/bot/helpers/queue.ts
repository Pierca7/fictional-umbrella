import Song from "models/song";

export class Queue<T> {
  protected _elements: Array<T>;

  public constructor(elements?: Array<T>) {
    this._elements = [];

    if (elements) {
      this._elements.push(...elements);
    }
  }

  public get length(): number {
    return this._elements.length;
  }

  public isEmpty(): boolean {
    return this._elements.length === 0;
  }

  public enqueue(element: T): number {
    return this._elements.push(element);
  }

  public dequeue(): T {
    return this._elements.shift();
  }

  public peek(): T {
    return this._elements[0];
  }
}

export class SongQueue extends Queue<Song> {
  public toString(): string {
    const songs = this._elements.map(
      (song, index) => `${index + 1}) ${song.title}`,
    );

    return songs.join("\n");
  }
}
