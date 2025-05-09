import { useState, useEffect, useRef, createContext, useContext } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = 'https://webapi-service-68779328892.europe-north2.run.app/notificationHub';
const NotificationContext = createContext();


let globalConnection = null;
let connectionCounter = 0;

const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // Only create a new connection if one doesn't exist
    if (!globalConnection) {
      console.log('Creating new SignalR connection');
      
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => {
            const token = getAuthToken();
            if (token) {
              return token;
            }
            console.warn('No auth token found for SignalR connection.');
            return '';
          }
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
      
      globalConnection = newConnection;
      
      // Start the connection
      newConnection.start()
        .then(() => {
          console.log('SignalR Connected successfully!');
          setIsConnected(true);
        })
        .catch(err => {
          console.error('SignalR Connection Error: ', err);
          setIsConnected(false);
        });
      
      // Event handlers
      newConnection.onreconnecting(error => {
        console.warn(`SignalR connection lost, attempting to reconnect: ${error}`);
        setIsConnected(false);
      });
      
      newConnection.onreconnected(connectionId => {
        console.log(`SignalR connection reestablished. Connected with connectionId: ${connectionId}`);
        setIsConnected(true);
      });
      
      newConnection.onclose(error => {
        console.warn(`SignalR connection closed: ${error}`);
        setIsConnected(false);
        globalConnection = null;
      });
    }
    
    // Increment connection counter
    connectionCounter++;
    
    // Setup notification handler if this is the first connection
    if (connectionCounter === 1 && globalConnection) {
      // Remove any existing handlers to prevent duplicates
      globalConnection.off("ReceiveNotification");
      
      // Add new handler
      globalConnection.on('ReceiveNotification', (receivedNotification) => {
        console.log('Notification received:', receivedNotification);
        setNotifications(prevNotifications => [receivedNotification, ...prevNotifications]);
      });
    }
    
    // Cleanup
    return () => {
      connectionCounter--;
      
      if (connectionCounter === 0 && globalConnection) {
        console.log('Stopping SignalR connection');
        globalConnection.stop().catch(err => console.error('Error stopping SignalR connection:', err));
        globalConnection = null;
      }
    };
  }, []);
  
  return (
    <NotificationContext.Provider value={{ notifications, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationHub = () => useContext(NotificationContext);