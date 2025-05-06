import * as PIXI from "pixi.js";
import { TransitionItemFactory } from "./TransitionItemFactory";

export abstract class Transition extends PIXI.Container {
	private itemContainer: PIXI.Container;

	public constructor(itemFactory: TransitionItemFactory, itemsCount: Number) {
		super();
		var clickBlocker = new PIXI.Graphics();
		clickBlocker.interactive = true;
		this.addChild(clickBlocker);
		this.itemContainer = new PIXI.Container();
		this.addChild(this.itemContainer);
		for (let i = 0; i < itemsCount; i++) {
			this.itemContainer.addChild(itemFactory.createItem());
		}
	}

	public abstract inAnimation(): Promise<Transition>;

	public abstract outAnimation(): Promise<Transition>;
}
