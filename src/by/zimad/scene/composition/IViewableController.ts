export interface IViewableController<T> {
    close(result: T): void;
}