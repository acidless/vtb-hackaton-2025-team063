export class CacheInvalidateEvent {
    constructor(
        public readonly entityId: number | string,
    ) {}
}
