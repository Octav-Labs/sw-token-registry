type Item<V> = {
  value: V;
  expiresAt: number;
};

export class TtlMap<K, V> {
  private map: Map<K, Item<V>>;
  private defaultTtl: number;
  private cleanupIntervalId: NodeJS.Timeout | null = null;

  constructor(defaultTtl: number = 36000000, cleanupInterval: number = 60000) {
    this.map = new Map<K, Item<V>>();
    this.defaultTtl = defaultTtl;

    // Start automatic cleanup if cleanupInterval is set to a positive number
    if (cleanupInterval > 0) {
      this.startCleanup(cleanupInterval);
    }
  }

  /**
   * Set a value in the map with a custom ttl (if provided).
   * @param key The key for the item.
   * @param value The value to store.
   * @param ttl Optional ttl in milliseconds for this item.
   */
  set(key: K, value: V, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTtl);
    this.map.set(key, { value, expiresAt });
  }

  /**
   * Get a value from the map. If the item has expired, it will be removed and undefined returned.
   * @param key The key of the item to retrieve.
   * @returns The value or undefined if expired or not present.
   */
  get(key: K): V | undefined {
    const item = this.map.get(key);

    if (!item) return undefined;
    if (item.expiresAt < Date.now()) {
      this.map.delete(key);
      return undefined;
    }

    return item.value;
  }

  /**
   * Delete an item from the map.
   * @param key The key of the item to delete.
   * @returns True if the item was deleted, false if it was not found.
   */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  /**
   * Check if an item exists in the map and has not expired.
   * @param key The key of the item to check.
   * @returns True if the item exists and has not expired, otherwise false.
   */
  has(key: K): boolean {
    const item = this.map.get(key);

    if (!item) return false;
    if (item.expiresAt < Date.now()) {
      this.map.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Clear all items from the map.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Get the number of items in the map that have not expired.
   * @returns The number of valid items in the map.
   */
  size(): number {
    this.cleanup();
    return this.map.size;
  }

  /**
   * Manually removes all expired items from the map.
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.map.entries()) {
      if (item.expiresAt < now) {
        this.map.delete(key);
      }
    }
  }

  /**
   * Starts the cleanup mechanism to automatically remove expired items at specified intervals.
   * @param interval Time in milliseconds between each cleanup check.
   */
  startCleanup(interval: number): void {
    if (this.cleanupIntervalId) return; // Prevent multiple intervals

    this.cleanupIntervalId = setInterval(() => this.cleanup(), interval);
  }

  /**
   * Stops the automatic cleanup mechanism.
   */
  stopCleanup(): void {
    if (this.cleanupIntervalId) {
      clearInterval(this.cleanupIntervalId);
      this.cleanupIntervalId = null;
    }
  }
}
