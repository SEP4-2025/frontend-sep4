// src/hooks/useNotificationHub.js
import { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
// No need to import types in JavaScript

const HUB_URL = 'http://localhost:8080/notificationHub'; // <<< ADAPT THIS URL! (Use environment variables for different environments)

// Function to get the JWT token (replace with your actual token retrieval logic)
// This is crucial for authenticated hubs.
const getAuthToken = () => {
  // Example: Retrieve from localStorage, an auth context, etc.
  return localStorage.getItem('jwtToken');
};

export const useNotificationHub = () => {
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef(null);

  useEffect(() => {
    // Create the connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // Pass the token factory if your hub requires authentication
        accessTokenFactory: () => {
          const token = getAuthToken();
          if (token) {
            return token;
          }
          // If no token, you might want to prevent connection or handle it.
          // For this example, we'll proceed, but an unauthenticated connection might be rejected by the server.
          console.warn('No auth token found for SignalR connection.');
          return ''; // Or throw an error if token is absolutely required to attempt connection
        }
      })
      .withAutomaticReconnect() // Handles temporary network issues
      .configureLogging(signalR.LogLevel.Information) // Optional: for debugging
      .build();

    connectionRef.current = newConnection;

    // Start the connection
    newConnection
      .start()
      .then(() => {
        console.log('SignalR Connected successfully!');
        setIsConnected(true);

        // Register a handler for receiving messages from the hub.
        // "ReceiveNotification" MUST MATCH the method name used on the server.
        newConnection.on('ReceiveNotification', (receivedNotification) => {
          console.log('Notification received:', receivedNotification);
          setNotifications(prevNotifications => [receivedNotification, ...prevNotifications]);
          // You might want to limit the number of stored notifications:
          // setNotifications(prev => [receivedNotification, ...prev.slice(0, 19)]);
        });
      })
      .catch(err => {
        console.error('SignalR Connection Error: ', err);
        setIsConnected(false);
      });

    // Event handlers for connection state (optional but good for UI feedback)
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
      // Optionally, you could try to restart the connection here after a delay,
      // if withAutomaticReconnect doesn't cover all scenarios.
    });

    // Cleanup on component unmount
    return () => {
      if (connectionRef.current && connectionRef.current.state === signalR.HubConnectionState.Connected) {
        console.log('Stopping SignalR connection');
        connectionRef.current.stop().catch(err => console.error('Error stopping SignalR connection:', err));
      }
    };
  }, []); // Empty dependency array ensures this effect runs once on mount and cleans up on unmount

  return { notifications, isConnected };
};