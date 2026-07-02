import {Asset} from "./Asset.ts";

export class AssetFactory {
    // Factory now accepts a generic type and passes it to Asset
    static create<T>(resourceUrl: string, meta: T | null = null): Asset<T> {
        return new Asset<T>(resourceUrl, meta)
    }
}