import * as PIXI from "pixi.js";
import { LoaderLayer } from "./layer/LoaderLayer";
import { NotificationLayer } from "./layer/NotificationLayer";
import { ViewableLayer } from "./layer/ViewableLayer";
import { Transition } from "./transition/Transition";
import { BaseView } from "./viewable/BaseView";
import { Viewable } from "./viewable/Viewable";

export class SceneManager {
	public readonly notificationsLayer: NotificationLayer;
	public readonly viewableLayer: ViewableLayer;
	public readonly loaderLayer: LoaderLayer;

	private defaultSceneTransition: Transition;

	public constructor(stage: PIXI.Container, defaultTransition: Transition) {
		this.viewableLayer = new ViewableLayer();
		stage.addChild(this.viewableLayer);
		this.notificationsLayer = new NotificationLayer();
		stage.addChild(this.notificationsLayer);
		this.loaderLayer = new LoaderLayer();
		stage.addChild(this.loaderLayer);
		this.defaultSceneTransition = defaultTransition;
	}

	private tryShowLoader(transition: Transition): Promise<Transition> {
		this.loaderLayer.addChild(transition);
		return transition.inAnimation();
	}

	private wrapViewableView(view: PIXI.DisplayObject): PIXI.Container {
		var blackout = new PIXI.Graphics();
		blackout.addChild(view);
		blackout.interactive = true;
		return blackout;
	}

	private async showViewableAsyncInternal<TResult>(parent: PIXI.Container, viewable: Viewable<TResult>): Promise<TResult> {
		var viewableContainer = viewable.view;
		parent.addChild(viewableContainer);
		function removeViewableContainer(parent:PIXI.Container, view: BaseView) {
			parent.removeChild(view);
			view.children.forEach(child => {
				child.destroy({ children: true, texture: false, baseTexture: false });
			});
			view.destroy(false);
		}
		return new Promise<TResult>((resolve, reject) => {
			viewable.operation.then((result) => {
				removeViewableContainer(parent, viewableContainer);
				resolve(result);
			}, (reason) => { 
				removeViewableContainer(parent, viewableContainer);
				reject(reason);
			});
		});
	}

	public async showViewableAsync<TResult>(viewable: Viewable<TResult>): Promise<TResult> {
		const result = await this.showViewableAsyncInternal<TResult>(this.viewableLayer, viewable);
		return result;
	}
}
