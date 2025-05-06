import { Sprite, Texture } from "pixi.js";

export class PuzzlePiece extends Sprite {
    public get state(): PuzzlePieceState { return this._state }
    private _state: PuzzlePieceState;

    constructor(texture: Texture) {
        super(texture);
    }

    public setState(state: PuzzlePieceState) {
        this._state = state;
        this.alpha = state === PuzzlePieceState.WRONG ? 0 : 1;
    }
}

export enum PuzzlePieceState {
    WRONG,
    RIGHT
}