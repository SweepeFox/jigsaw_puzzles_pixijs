import { BaseResourcesPackage } from "./BaseResourcesPackage";

export class ResourceManager {
    private packages: Map<String, BaseResourcesPackage>;

    public constructor() {
        this.packages = new Map();
    }

    public registerResourcePackage<T extends BaseResourcesPackage>(resourcePackage: T) {
        var key = resourcePackage.constructor.name;
        if (this.packages.has(key)) {
            throw new Error(`Can't register resource package ${key}. Already have one registered.`);
        }
        this.packages.set(key, resourcePackage);
    }

    public async getResourcePackage<T extends BaseResourcesPackage>(clsT: new() => T): Promise<T> {
        const key = clsT.name;
        if (!this.packages.has(key)) {
            throw new Error(`Package ${key} not registered. Try register it before using.`);
        }
        var resourcePackage = this.packages.get(key);
        if (resourcePackage.loaded) {
            return resourcePackage as T;
        } else {
            const pkg = await resourcePackage.load();
            return pkg as T;
        }
    }
}