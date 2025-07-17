// Singleton service to manage rooms data globally
import { getAllRooms } from "../api/services/index";
import { transformRoomData } from "../utils/mockData";
import { Room } from "../types/interfaces";

class RoomsService {
  private static instance: RoomsService;
  private cache: Room[] | null = null;
  private lastFetchTime = 0;
  private isCurrentlyFetching = false;
  private subscribers: Array<(rooms: Room[]) => void> = [];
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private constructor() {}

  static getInstance(): RoomsService {
    if (!RoomsService.instance) {
      RoomsService.instance = new RoomsService();
    }
    return RoomsService.instance;
  }

  subscribe(callback: (rooms: Room[]) => void): () => void {
    this.subscribers.push(callback);
    
    // If we have cached data, immediately call the callback
    if (this.cache) {
      callback(this.cache);
    }
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(rooms: Room[]) {
    this.subscribers.forEach(callback => callback(rooms));
  }

  async fetchRooms(forceRefresh = false): Promise<Room[]> {
    const now = Date.now();
    
    // Check cache validity
    if (!forceRefresh && this.cache && (now - this.lastFetchTime) < this.CACHE_DURATION) {
      console.log("🎯 RoomsService: Using cached data");
      return this.cache;
    }

    // Prevent concurrent requests
    if (this.isCurrentlyFetching) {
      console.log("⏳ RoomsService: Fetch already in progress");
      return this.cache || [];
    }

    try {
      this.isCurrentlyFetching = true;
      console.log("🔄 RoomsService: Fetching from API");
      
      const response = await getAllRooms();
      
      if (response && response.data) {
        const transformedRooms = response.data.map(transformRoomData);
        this.cache = transformedRooms;
        this.lastFetchTime = now;
        
        console.log("✅ RoomsService: Data fetched and cached", transformedRooms.length, "rooms");
        this.notifySubscribers(this.cache);
        
        return this.cache;
      } else {
        console.log("❌ RoomsService: No data received");
        this.cache = [];
        this.lastFetchTime = now;
        this.notifySubscribers([]);
        return [];
      }
    } catch (error) {
      console.error("❌ RoomsService: Fetch error", error);
      const emptyRooms: Room[] = [];
      this.notifySubscribers(emptyRooms);
      return emptyRooms;
    } finally {
      this.isCurrentlyFetching = false;
    }
  }

  getCachedRooms(): Room[] | null {
    return this.cache;
  }

  clearCache(): void {
    this.cache = null;
    this.lastFetchTime = 0;
  }
}

export default RoomsService;
