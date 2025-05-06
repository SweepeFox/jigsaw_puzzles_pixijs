import { Container, Texture } from "pixi.js";
import { PointerEvent } from "../events/PointerEvent";
import { Widget } from "./Widget";

export class Button extends Widget {
    
    private up: Texture;
    private down: Texture;
    private over: Texture;
    private disabled: Texture;

    public constructor(parent: Container, up: Texture, over: Texture = null, down: Texture = null, disabled: Texture = null) {
        super(parent);
        this.interactive = true;
        this.buttonMode = true;
        this.texture = this.up = up;
        this.down = down;
        this.over = over;
        this.disabled = disabled;
        this.on(PointerEvent.Up, this.onPointerUp);
        this.on(PointerEvent.Down, this.onPointerDown);
        this.on(PointerEvent.Over, this.onPointerOver);
        this.on(PointerEvent.Out, this.onPointerOut);
    }

    protected onPointerUp() {
        if (this.enabled) {
            this.texture = this.over ? this.over : this.up;
        } else {
            if (this.disabled !== null) {
                this.texture = this.disabled;
            }
        }
    }

    protected onPointerDown() {
        if (this.down !== null) {
            this.texture = this.down;
        }
    }

    protected onPointerOver() {
        if (this.over !== null) {
            this.texture = this.over;
        }
    }

    protected onPointerOut() {
        this.texture = this.up;
    }
}