import {
  type WorldRuntimeEvent,
  type WorldRuntimeEventHandler,
  type WorldRuntimeEventMap,
  type WorldRuntimeEventType,
} from "./worldRuntimeEvents";

export type WorldEventBusUnsubscribe = () => void;

export type WorldEventBusSnapshot = {
  listenerCount: number;
  eventCount: number;
  lastEvent: WorldRuntimeEvent | null;
};

const createEventId = () => {
  return `world-runtime-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export class WorldEventBus {
  private listeners = new Map<WorldRuntimeEventType, Set<WorldRuntimeEventHandler<any>>>();
  private eventCount = 0;
  private lastEvent: WorldRuntimeEvent | null = null;

  on<TType extends WorldRuntimeEventType>(
    type: TType,
    handler: WorldRuntimeEventHandler<TType>
  ): WorldEventBusUnsubscribe {
    const handlers = this.listeners.get(type) ?? new Set();
    handlers.add(handler);
    this.listeners.set(type, handlers);

    return () => {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.listeners.delete(type);
      }
    };
  }

  once<TType extends WorldRuntimeEventType>(
    type: TType,
    handler: WorldRuntimeEventHandler<TType>
  ): WorldEventBusUnsubscribe {
    const unsubscribe = this.on(type, (event) => {
      unsubscribe();
      handler(event);
    });

    return unsubscribe;
  }

  emit<TType extends WorldRuntimeEventType>(
    type: TType,
    payload: WorldRuntimeEventMap[TType]
  ): WorldRuntimeEvent<TType> {
    const event: WorldRuntimeEvent<TType> = {
      type,
      payload,
      timestamp: Date.now(),
      id: createEventId(),
    };

    this.eventCount += 1;
    this.lastEvent = event;

    const handlers = this.listeners.get(type);

    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }

    return event;
  }

  clear(): void {
    this.listeners.clear();
  }

  getSnapshot(): WorldEventBusSnapshot {
    let listenerCount = 0;

    for (const handlers of this.listeners.values()) {
      listenerCount += handlers.size;
    }

    return {
      listenerCount,
      eventCount: this.eventCount,
      lastEvent: this.lastEvent,
    };
  }
}

export const createWorldEventBus = () => new WorldEventBus();
