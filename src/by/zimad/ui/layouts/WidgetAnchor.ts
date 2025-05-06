export class WidgetAnchor {
    public readonly valign: VAnchor;
    public readonly halign: HAnchor;

    constructor(valign: VAnchor = VAnchor.Top, halign: HAnchor = HAnchor.Left) {
        this.valign = valign;
        this.halign = halign;
    }
}

export enum VAnchor {
    Top,
    Center,
    Bottom,
    Stretch
}

export enum HAnchor {
    Left,
    Center,
    Right,
    Stretch
}