import { Loader } from "@pixi/loaders";
import { Texture } from "@pixi/core";
import { ILoaderResource } from "@pixi/loaders";

export class BaseResourcesLoader {
	private resources: Map<string, ILoaderResource>;

	private _loaded: boolean;
	public get isLoaded(): boolean {
		return this._loaded;
	}

	public constructor() {
		this.resources = new Map<string, ILoaderResource>();
		this._loaded = false;
	}

	public getResource(path: string): ILoaderResource {
		const resourceId = path.toLowerCase();
		if (!this.resources.has(resourceId)) {
			throw new Error(`Resource '${path}' not found in ${this.constructor.name}.`);
		}
		const resource = this.resources.get(resourceId);
		return resource;
	}

	public getTexture(path: string): Texture {

		const resource = this.getResource(path);
		return resource.texture;
	}

	public add(resourceLocation: string): string {
		this.resources.set(resourceLocation, null);
		return resourceLocation;
	}

	public async load(): Promise<BaseResourcesLoader> {
		return new Promise((resolve, reject) => {
			if (!this._loaded) {
				const loader: Loader = new Loader();
				loader.onComplete.add((loader: Loader) => {
					resolve(this);
				});

				this.resources.forEach((value, key) => 
				{
					loader.add(key, key, null, (resource) => 
					{
						this.resources.set(key, resource);
					})
				});

				loader.load(() => {
					this._loaded = true;
				});
			} else {
				resolve(this);
			}
		});
	}

}