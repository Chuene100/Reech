import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState()
    // const SOCKET_SERVER_URL = "https://reech-node-api-7o3szyfdpq-uc.a.run.app/";
    const SOCKET_SERVER_URL = "http://localhost:8081";
    const user = useSelector((state) => state.user.current_user);


    useEffect(() => {
        const newSocket = io.connect(
            SOCKET_SERVER_URL,
            { query: { _id: user._id } }
        )
        setSocket(newSocket)

        return () => newSocket.close()
    }, [user])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}