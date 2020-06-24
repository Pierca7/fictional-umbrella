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

  public dequeue(): T {
    return this._elements.shift();
  }

  public empty(): void {
    this._elements = [];
  }

  public enqueue(element: T): number {
    return this._elements.push(element);
  }

  public isEmpty(): boolean {
    return this._elements.length === 0;
  }

  public peek(): T {
    return this._elements[0];
  }
}

export class SongQueue extends Queue<Song> {
  private _current: number;

  constructor(elements?: Array<Song>) {
    super(elements);

    this._current = 0;
  }

  public get currentIndex(): number {
    return this._current;
  }

  public get currentSong(): Song {
    return this._elements[this._current];
  }

  public changeSong(index: number): void {
    this._current = index;
  }

  public toString(): string {
    const songs = this._elements.map(
      (song, index) => `${index + 1}) ${song.title}`,
    );

    return songs.join("\n");
  }
}
