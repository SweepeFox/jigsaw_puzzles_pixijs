import { ILoaderResource, Texture } from "pixi.js";
import { BaseResourcesLoader } from "./BaseResourcesLoader";

export abstract class BaseResourcesPackage {
	public get loaded(): boolean {
		return this.loader.isLoaded;
	}

	private loader: BaseResourcesLoader;

	public constructor() {
		this.loader = new BaseResourcesLoader();
		this.registerResourcesForDownload();
	}

	public async load(): Promise<BaseResourcesPackage> {
		return new Promise((resolve, reject) => {
			this.loader.load()
				.then(
					(ld: BaseResourcesLoader) => {
						resolve(this);
					},
					(reason: Error) => {
						reject(reason);
					}
				);
		});
	}

	public add(path: string): string {
		return this.loader.add(path);
	}

	public resource(path: string): ILoaderResource {
		if (!this.loaded) {
			throw new Error(`Package ${this.constructor.name} not yet loaded.`);
		}
		return this.loader.getResource(path);
	}

	protected abstract registerResourcesForDownload(): void;

	public texture(path: string): Texture {
		if (!this.loaded) {
			throw new Error(`Package ${this.constructor.name} not yet loaded.`);
		}
		return this.loader.getTexture(path);
	}

}
