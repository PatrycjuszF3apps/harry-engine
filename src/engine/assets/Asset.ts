export class Asset {
    readonly _resourceUrl: string
    readonly _meta: Object | null

    constructor(resourceUrl: string, meta: Object | null) {
        this._resourceUrl = resourceUrl
        this._meta = meta
    }


    get resourceUrl(): string {
        return this._resourceUrl;
    }

    get meta(): Object | null {
        return this._meta;
    }
}