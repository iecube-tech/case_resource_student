import { defineStore } from "pinia";

export const useRouteCacheStore = defineStore("useRouteCacheStore", {
    state: () => ({
        routeCache: [],
    }),
    getters: {
        isRouteCached: (state) => (routeName) => {
            return state.routeCache.includes(routeName);
        },
        getCachedRoutes: (state) => {
            return state.routeCache;
        },
    },
    actions: {
        addRouteToCache(routeName) {
            if (!this.routeCache.includes(routeName)) {
                this.routeCache.push(routeName);
                console.log(`Route "${routeName}" added to cache.`);
            } else {
                console.log(`Route "${routeName}" is already cached.`);
            }
        },
        removeRouteFromCache(routeName) {
            const index = this.routeCache.indexOf(routeName);
            if (index !== -1) {
                this.routeCache.splice(index, 1);
                console.log(`Route "${routeName}" removed from cache.`);
            } else {
                console.log(`Route "${routeName}" is not in the cache.`);
            }
        },
        clearRouteCache() {
            this.routeCache = [];
            console.log("All routes have been removed from the cache.");
        },
    },
});
