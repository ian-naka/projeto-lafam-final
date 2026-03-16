// um event bus simples usando javascript nativo (eventtarget)
class EventBus extends EventTarget {
    emit(eventName: string, detail?: any) {
        this.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
    
    on(eventName: string, callback: (e: any) => void) {
        this.addEventListener(eventName, callback as EventListener);
    }

    off(eventName: string, callback: (e: any) => void) {
        this.removeEventListener(eventName, callback as EventListener);
    }
}

export default new EventBus();
