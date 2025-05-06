import { Container, Texture } from "pixi.js";
import { Button } from "./Button";

export class ToggleButton extends Button {
    private readonly upActiveTexture: Texture;
    private readonly upDisactiveTexture: Texture;
    private readonly overActiveTexture: Texture;
    private readonly overDisactiveTexture: Texture;
    private readonly downActiveTexture: Texture;
    private readonly downDisactiveTexture: Texture;
    protected isActive: boolean = true;

    public constructor(parent: Container, upActive: Texture, upDisactive: Texture, overActive: Texture, overDisactive: Texture, downActive: Texture, downDisactive: Texture) {
        super(parent, upActive);
        this.upActiveTexture = upActive;
        this.upDisactiveTexture = upDisactive;
        this.overActiveTexture = overActive;
        this.overDisactiveTexture = overDisactive;
        this.downActiveTexture = downActive;
        this.downDisactiveTexture = downDisactive;
    }

    protected override onPointerDown(): void {
        this.texture = this.isActive ? this.downActiveTexture : this.downDisactiveTexture;
    }

    protected override onPointerUp(): void {
        this.isActive = !this.isActive;
        this.texture = this.isActive ? this.upActiveTexture : this.upDisactiveTexture;
    }

    protected override onPointerOver(): void {
        this.texture = this.isActive ? this.overActiveTexture : this.overDisactiveTexture;
    }

    protected override onPointerOut(): void {
        this.texture = this.isActive ? this.upActiveTexture : this.upDisactiveTexture;
    }
}