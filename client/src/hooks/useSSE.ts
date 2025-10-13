import { useEffect, useRef, useState } from 'react';

interface UseSSEOptions<T> {
  url: string;
  enabled?: boolean;
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
}

interface UseSSEResult<T> {
  data: T | null;
  error: Event | null;
  isConnected: boolean;
  close: () => void;
}

/**
 * Custom hook for Server-Sent Events (SSE)
 * Replaces polling with real-time updates
 */
export function useSSE<T = any>({
  url,
  enabled = true,
  onMessage,
  onError,
  onOpen,
}: UseSSEOptions<T>): UseSSEResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Event | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    console.log('🔌 SSE: Connecting to', url);

    // Create EventSource connection
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ SSE: Connected to', url);
      setIsConnected(true);
      setError(null);
      onOpen?.();
    };

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data) as T;
        console.log('📨 SSE: Received data:', parsedData);
        setData(parsedData);
        onMessage?.(parsedData);
      } catch (err) {
        console.error('❌ SSE: Error parsing message:', err);
      }
    };

    // Listen for custom error events from server
    eventSource.addEventListener('error', (event: any) => {
      if (event.data) {
        try {
          const errorData = JSON.parse(event.data);
          console.error('❌ SSE: Server error:', errorData);
        } catch (e) {
          console.error('❌ SSE: Could not parse error data');
        }
      }
    });

    eventSource.onerror = (err) => {
      console.error('❌ SSE: Connection error:', err);
      console.error('❌ SSE: ReadyState:', eventSource.readyState);
      console.error('❌ SSE: URL:', url);
      setError(err);
      setIsConnected(false);
      onError?.(err);

      // EventSource will automatically try to reconnect
      // If you want to stop reconnection, close it:
      // eventSource.close();
    };

    // Cleanup on unmount or when dependencies change
    return () => {
      console.log('🔌 SSE: Closing connection to', url);
      eventSource.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    };
  }, [url, enabled]);

  const close = () => {
    if (eventSourceRef.current) {
      console.log('🔌 SSE: Manually closing connection');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  };

  return { data, error, isConnected, close };
}
