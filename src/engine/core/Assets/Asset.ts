export class Asset<T = unknown> {
    readonly _resourceUrl: string
    readonly _meta: T | null

    constructor(resourceUrl: string, meta: T | null) {
        this._resourceUrl = resourceUrl
        this._meta = meta
    }

    get resourceUrl(): string {
        return this._resourceUrl;
    }

    get meta(): T | null {
        return this._meta;
    }
}