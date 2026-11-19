import { useEffect, useRef } from 'react';

export function usePolling(fn, intervalMs = 10000) {
  const savedCallback = useRef(fn);

  useEffect(() => {
    savedCallback.current = fn;
  }, [fn]);

  useEffect(() => {
    function tick() {
      // Pause polling when browser tab is inactive / hidden
      if (!document.hidden && savedCallback.current) {
        savedCallback.current();
      }
    }

    // Call immediately once
    tick();

    const id = setInterval(tick, intervalMs);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        tick();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs]);
}

export default usePolling;
