interface Window {
  gtag: (command: string, eventName: string, params?: any) => void;
  scrollEventsFired?: Record<number, boolean>;
}