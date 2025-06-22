import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
// const { Peer } = await import('peerjs');
import Peer, {type DataConnection } from 'peerjs'; // todo: see if this breaks anything

interface WebRTCContextType {
  peerId: string | null;
  connectionState: string;
  connectedPeerId: string | null;
  error: string | null;
  isHost: boolean; // If you recieved the connection you are the host
  isConnected: boolean;
  connectToPeer: (targetPeerId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendData: (data: any) => boolean;
  registerDataHandler: (messageType: string, handler: (data: any) => void) => () => void;
  disconnect: () => void;
  CONNECTION_STATES: typeof CONNECTION_STATES;
}

const WebRTCContext = createContext<WebRTCContextType | null>(null);

const CONNECTION_STATES = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error'
} as const;

interface WebRTCProviderProps {
  children: ReactNode;
}

let peer: Peer | null = null;
let connection: DataConnection | null = null;
const dataHandlers = new Map<string, (data: any) => void>();

export const WebRTCProvider = ({ children }: WebRTCProviderProps) => {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [connectionState, setConnectionState] = useState<string>(CONNECTION_STATES.DISCONNECTED);
  const [error, setError] = useState<string | null>(null);
  const [connectedPeerId, setConnectedPeerId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);


  const setupConnection = (conn: any) => {

    conn.on('open', () => {
      console.log('Connection opened, open:', conn.open);
      setConnectionState(CONNECTION_STATES.CONNECTED);
      setError(null);
    });

    conn.on('data', (data: any) => {
      // defines the schema of the data received
      console.log('Received data:', data);
      if (data?.type && dataHandlers.has(data.type)) {
        const handler = dataHandlers.get(data.type);
        handler?.(data);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    conn.on('error', (err: any) => {
      console.log('Connection error:', err);
      setError(err.message);
      setConnectionState(CONNECTION_STATES.ERROR);
    });

    conn.on('close', () => {
      console.log('Connection closed');
      setConnectionState(CONNECTION_STATES.DISCONNECTED);
      setConnectedPeerId(null);
      conn = null;
    });
  };

  const initializePeer = async () => {
    if (peer) {
      return;
    }

    try {
      peer = new Peer({
        config: {
          iceServers: [
            { urls: 'stun:freestun.net:3478' },
            {
              urls: "turn:global.relay.metered.ca:80?transport=tcp",
              username: "e081dacd5259e19dc89ffc43",
              credential: "Hi3wr7k9WFIpZMZc",
            },
            {
              urls: "turn:global.relay.metered.ca:443",
              username: "e081dacd5259e19dc89ffc43",
              credential: "Hi3wr7k9WFIpZMZc",
            },
            {
              urls: "turns:global.relay.metered.ca:443?transport=tcp",
              username: "e081dacd5259e19dc89ffc43",
              credential: "Hi3wr7k9WFIpZMZc",
            },
          ]
        }
      });

      peer.on('open', (id: string) => {
        setPeerId(id);
        setConnectionState(CONNECTION_STATES.DISCONNECTED);
        setError(null);
      });

      peer.on('connection', (conn: any) => {
        console.log('Incoming connection from:', conn.peer);
        setIsHost(true);
        console.log("Serving as host for peer:", conn.peer);
        setupConnection(conn);
        setConnectedPeerId(conn.peer);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      peer.on('error', (err: any) => {
        setError(err.message);
        setConnectionState(CONNECTION_STATES.ERROR);
      });
    } catch {
      setError('Failed to initialize WebRTC');
      setConnectionState(CONNECTION_STATES.ERROR);
    }
  };

  // Function to initiate connection to a peer as a client
  const connectToPeer = useCallback((targetPeerId: string) => {
    if (!peer || !targetPeerId) return;

    setConnectionState(CONNECTION_STATES.CONNECTING);
    const conn = peer.connect(targetPeerId);
    setupConnection(conn);
    console.log("Connecting as client to peer:", targetPeerId);
    
    setConnectedPeerId(targetPeerId);
  }, []);

  const sendData = useCallback((data: any) => {
    console.log('Attempting to send data:', data);
    console.log('Connection object:', connection);
    console.log('Connection open:', connection?.open);
    
    if (connection && connection.open) {
      connection.send(data);
      console.log('Data sent successfully');
      return true;
    }
    console.error('Connection not ready. open:', connection?.open);
    return false;
  }, []);

  const registerDataHandler = useCallback((messageType: string, handler: (data: any) => void) => {
    dataHandlers.set(messageType, handler);
    return () => {
      dataHandlers.delete(messageType);
      return true;
    };
  }, []);

  const disconnect = useCallback(() => {
    connection?.close();
  }, []);

  // Main initialization effect
  useEffect(() => {
    initializePeer();
    return () => {
      connection?.close();
      peer?.destroy();
      peer = null;
      connection = null;
    };
  }, []);

  const value: WebRTCContextType = {
    peerId,
    connectionState,
    connectedPeerId,
    error,
    isConnected: connectionState === CONNECTION_STATES.CONNECTED,
    isHost,
    connectToPeer,
    sendData,
    registerDataHandler,
    disconnect,
    CONNECTION_STATES
  };

  return (
    <WebRTCContext.Provider value={value}>
      {children}
    </WebRTCContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};
