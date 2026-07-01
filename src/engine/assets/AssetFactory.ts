import {Asset} from "./Asset.ts";

export class AssetFactory {

    static create(resourceUrl: string): Asset {
        return new Asset(resourceUrl, {})
    }

}