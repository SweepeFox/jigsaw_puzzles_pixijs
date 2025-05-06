import { PointerEvent } from "../../../../ui/events/PointerEvent";
import { OutlineFilter } from "../../../filters/OutlineFilter";
import { Sprite, Texture } from "pixi.js";
import MiniSignal from "mini-signals";
import { gsap } from "gsap";

export class BarPuzzlePiece extends Sprite {
    public readonly startDrag: MiniSignal = new MiniSignal();
    public readonly endDrag: MiniSignal = new MiniSignal();

    public readonly index: number;
    private isDragging: boolean = false;

    constructor(texture: Texture, index: number) {
        super(texture);

        this.index = index;
        this.interactive = true;
        this.buttonMode = true;
        this.anchor.set(0.5);

        this.on(PointerEvent.Down, this.onStartDrag);
        this.on(PointerEvent.Up, this.onEndDrag);
    }

    public playWrongAnimation(): void {
        gsap.set(this, { tint: 0xFF0000 });
        gsap.delayedCall(0.2, () => {
            gsap.set(this, { tint: 0xFFFFFF });
        });
    }

    private onStartDrag() {
        if (this.isDragging) {
            return;
        }

        this.isDragging = true;
        this.filters = [new OutlineFilter()];
        this.startDrag.dispatch(this.index);
    }

    private onEndDrag() {
        if (!this.isDragging) {
            return;
        }

        this.isDragging = false;
        this.filters = [];
        this.endDrag.dispatch(this.index);
    }
}