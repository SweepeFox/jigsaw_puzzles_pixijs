import { Bounds, Container, DisplayObject } from "pixi.js";
import { Widget } from "./Widget"

export class Box extends Widget {
    protected dirty: boolean;

    constructor(parent: Container) {
        super(parent);
        this.dirty = false;
    }

    protected override _calculateBounds() {
        const bounds = new Bounds();
        bounds.minX = this.x;
        bounds.minY = this.y;
        bounds.maxX = this._width;
        bounds.maxY = this._height;
        this._bounds.addBounds(bounds);
    }

    protected alignChildren(respectDirty: boolean = true) {
        if (respectDirty && !this.dirty) {
            return;
        }
        this.alignmentStrategy();
    }

    public override addChild<T extends DisplayObject[]>(...children: T): T[0] {
        children.forEach(child => {
            super.addChild(child);
        });
        this.dirty = true;
        this.alignChildren();
        return children[0];
    }

    protected alignmentStrategy() {
    }
}
