import { Container, TextStyle, Text as PIXIText } from "pixi.js";
import { Widget } from "./Widget";

export class Text extends Widget {
    private textField: PIXIText;
    public get text(): string {
        return this.textField.text;
    }
    public set text(v: string) {
        this.textField.text = v;
    }
    public constructor(text: string, style: TextStyle,parent: Container) {
        super(parent);
        this.textField = new PIXIText(text, style);
        this.addChild(this.textField);
    }

    public override set tint(v: number) {
        super.tint = v;
        if (this.textField) {
            this.textField.tint = v;
        }
    }
}