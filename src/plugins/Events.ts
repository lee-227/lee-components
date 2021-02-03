type Listener = SimpleFunction & { fn?: any };
type ListenerName = string | symbol;
export type PlainEvents = ReturnType<typeof createPlainEvent>;
export function createPlainEvent() {
  const getListenMap = (() => {
    let events: Map<ListenerName, Listener[]>;
    return () => {
      if (!events) {
        events = new Map();
      }
      return events;
    };
  })();
  const events = {
    on: (listenerName: ListenerName, fn: SimpleFunction) => {
      const listenMap = getListenMap();
      const map = listenMap.get(listenerName);
      if (!map) {
        listenMap.set(listenerName, [fn]);
      } else {
        map.push(fn);
      }
      return () => events.off(listenerName, fn);
    },
    once: (listenerName: ListenerName, fn: SimpleFunction) => {
      const on = (...args: []) => {
        fn(...args);
        events.off(listenerName, on);
      };
      on.fn = fn;
      events.on(listenerName, on);
      return () => events.off(listenerName, fn);
    },
    off: (listenerName: ListenerName, fn?: SimpleFunction) => {
      const listenMap = getListenMap();
      const map = listenMap.get(listenerName);
      if (!map) return;
      if (!fn) {
        listenMap.set(listenerName, []);
        return;
      }
      for (let i = 0; i < map.length; i++) {
        let listener = map[i];
        if (
          fn === listener ||
          (listener && listener.fn && listener.fn === fn)
        ) {
          map.splice(1, i);
        }
      }
    },
    emit: (listenerName: ListenerName, ...args: any[]) => {
      let map = getListenMap();
      let listeners = map.get(listenerName);
      listeners?.forEach(fn => fn(...args));
    }
  };
  return events;
}
