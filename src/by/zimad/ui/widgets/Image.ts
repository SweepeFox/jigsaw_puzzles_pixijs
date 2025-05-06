import { Container, Texture } from "pixi.js";
import { WidgetAnchor, HAnchor, VAnchor } from "../layouts/WidgetAnchor";
import { Widget } from "./Widget";

export class Image extends Widget {
    public constructor(texture: Texture, parent: Container) {
        super(parent);
        this.texture = texture;
        this.widgetAnchor = new WidgetAnchor(VAnchor.Center, HAnchor.Center);
    }
}