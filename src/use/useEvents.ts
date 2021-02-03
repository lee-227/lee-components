import { createPlainEvent } from "@/plugins/Events";
import { kebaCase } from "@/utils/kebaCase";
import { getCurrentInstance } from "vue";

function emitName2ListenName(emitName: string) {
  const match = emitName.match(/update([A-Z])(.*)/);
  if (match) {
    return `update:${match[1].toLocaleLowerCase()}${match[2]}`;
  }
  return kebaCase(emitName)!;
}
type EventListener<EmitsValue> = EmitsValue extends (...args: any[]) => any
  ? Parameters<EmitsValue>
  : never;
export type ComponentEvent<Emit> = {
  emit: { [key in keyof Emit]: (...args: EventListener<Emit[key]>) => void };
  on: {
    [key in keyof Emit]: (
      cb: (...args: EventListener<Emit[key]>) => void
    ) => void;
  };
  once: {
    [key in keyof Emit]: (
      cb: (...args: EventListener<Emit[key]>) => void
    ) => void;
  };
  off: {
    [key in keyof Emit]: (
      cb: (...args: EventListener<Emit[key]>) => void
    ) => void;
  };
};
export function getComponentEmit<T>(emitObject: T): T {
  return {
    change: null,
    ...Object.keys(emitObject || {}).reduce((ret, key) => {
      ret[emitName2ListenName(key)] = (emitObject as any)[key];
      return ret;
    }, {} as any)
  };
}
export function useEvent<T>(emitObject: T): ComponentEvent<T> {
  const ctx = getCurrentInstance();
  const event = createPlainEvent();
  const emit = {} as any;
  const on = {} as any;
  const once = {} as any;
  const off = {} as any;
  Object.keys(emitObject || {}).forEach(key => {
    const kebaCaseName = emitName2ListenName(key);
    emit[key] = (...args: any[]) => {
      ctx?.emit(kebaCaseName, ...args);
      event.emit(kebaCaseName, ...args);
      if (key === "updateModelValue") {
        ctx?.emit("change", ...args);
        event.emit("change", ...args);
      }
    };
    on[key] = (fn: SimpleFunction) => event.on(kebaCaseName, fn);
    once[key] = (fn: SimpleFunction) => event.once(kebaCaseName, fn);
    off[key] = (fn: SimpleFunction) => event.off(kebaCaseName, fn);
  });
  return {
    emit,
    on,
    once,
    off
  };
}
