import type { Response } from "express";

// SSE Manager for pushing real-time updates to clients
class SSEManager {
  private connections: Map<number, Set<Response>> = new Map();

  // Subscribe a client to updates for a specific analysis
  subscribe(analysisId: number, res: Response) {
    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no' // Disable nginx buffering
    });

    // Send initial comment to establish connection
    res.write(': connected\n\n');

    // Add connection to tracking
    if (!this.connections.has(analysisId)) {
      this.connections.set(analysisId, new Set());
    }
    this.connections.get(analysisId)!.add(res);

    console.log(`📡 SSE: Client subscribed to analysis ${analysisId} (${this.connections.get(analysisId)!.size} total)`);

    // Handle client disconnect
    res.on('close', () => {
      this.unsubscribe(analysisId, res);
    });
  }

  // Unsubscribe a client
  unsubscribe(analysisId: number, res: Response) {
    const clients = this.connections.get(analysisId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        this.connections.delete(analysisId);
      }
      console.log(`📡 SSE: Client unsubscribed from analysis ${analysisId} (${clients.size} remaining)`);
    }
  }

  // Send update to all clients listening to a specific analysis
  sendUpdate(analysisId: number, data: any) {
    const clients = this.connections.get(analysisId);
    if (!clients || clients.size === 0) {
      console.log(`📡 SSE: No clients listening for analysis ${analysisId}`);
      return;
    }

    const eventData = `data: ${JSON.stringify(data)}\n\n`;

    // Send to all connected clients
    clients.forEach((res) => {
      try {
        res.write(eventData);
        console.log(`📡 SSE: Sent update to client for analysis ${analysisId}`);
      } catch (error) {
        console.error(`📡 SSE: Error sending to client:`, error);
        this.unsubscribe(analysisId, res);
      }
    });

    // If analysis is completed or failed, close connections
    if (data.status === 'completed' || data.status === 'failed') {
      this.closeConnections(analysisId);
    }
  }

  // Close all connections for a specific analysis
  closeConnections(analysisId: number) {
    const clients = this.connections.get(analysisId);
    if (clients) {
      clients.forEach((res) => {
        try {
          res.end();
        } catch (error) {
          console.error(`📡 SSE: Error closing connection:`, error);
        }
      });
      this.connections.delete(analysisId);
      console.log(`📡 SSE: Closed all connections for analysis ${analysisId}`);
    }
  }

  // Get connection count for debugging
  getConnectionCount(analysisId?: number): number {
    if (analysisId) {
      return this.connections.get(analysisId)?.size || 0;
    }
    let total = 0;
    this.connections.forEach(clients => total += clients.size);
    return total;
  }
}

// Export singleton instance
export const sseManager = new SSEManager();
