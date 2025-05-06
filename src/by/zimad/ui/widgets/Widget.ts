import { Container, Sprite } from "pixi.js";
import { WidgetAnchor, HAnchor, VAnchor } from "../layouts/WidgetAnchor";

export class Widget extends Sprite {
    private _widgetAnchor: WidgetAnchor;

    public get widgetAnchor(): WidgetAnchor {
        return this._widgetAnchor;
    }

    public set widgetAnchor(v: WidgetAnchor) {
        let x: number, y: number;
        switch (v.valign) {
            case VAnchor.Stretch:
            case VAnchor.Top:
                y = 0.0;
                break;
            case VAnchor.Center:
                y = 0.5;
                break;
            case VAnchor.Bottom:
                y = 1.0;
                break;
        }
        switch (v.halign) {
            case HAnchor.Left:
            case HAnchor.Stretch:
                x = 0.0;
                break;
            case HAnchor.Center:
                x = 0.5;
                break;
            case HAnchor.Right:
                x = 1.0;
                break;
        }
        super.anchor.set(x, y);
        this._widgetAnchor = v;
    }

    protected _enabled: boolean;

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(v: boolean) {
        this.interactive = v;
        this.interactiveChildren = v;
        this.buttonMode = v;
        this._enabled = v;
    }

    public override set tint(v: number) {
        super.tint = v;
        this.children.forEach(child => {
            if (child instanceof Widget) {
                child.tint = v;
            }
        });
    }

    public constructor(parent: Container) {
        super();
        parent.addChild(this);
        this.widgetAnchor = new WidgetAnchor(VAnchor.Top, HAnchor.Left);
        this._enabled = true;
    }
    
}