import { Rectangle } from "pixi.js";

export class ScreenInfoProvider {
    private _screenInfo: Rectangle;

    public get screenWidth(): number {
        return this._screenInfo.width;
    }

    public get screenHeight(): number {
        return this._screenInfo.height;
    }

    constructor(screenInfo: Rectangle) {
        this._screenInfo = screenInfo;
    }
}