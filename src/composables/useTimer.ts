import { ref, onUnmounted } from 'vue';

const TOTAL_SECONDS = 30 * 60; // 30분

export function useTimer(onTimeUp: () => void) {
  const remainingSeconds = ref(TOTAL_SECONDS);
  const isRunning = ref(false);
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function start() {
    if (isRunning.value) return;
    isRunning.value = true;
    intervalId = setInterval(() => {
      remainingSeconds.value--;
      if (remainingSeconds.value <= 0) {
        stop();
        onTimeUp();
      }
    }, 1000);
  }

  function stop() {
    isRunning.value = false;
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function reset() {
    stop();
    remainingSeconds.value = TOTAL_SECONDS;
  }

  function getElapsedSeconds(): number {
    return TOTAL_SECONDS - remainingSeconds.value;
  }

  onUnmounted(() => {
    stop();
  });

  return {
    remainingSeconds,
    isRunning,
    start,
    stop,
    reset,
    getElapsedSeconds,
  };
}
