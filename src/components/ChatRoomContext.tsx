import React, { createContext, useState, ReactNode } from "react";

interface ChatRoomContextType {
  chatRoomId: number | null;
  setChatroomId: React.Dispatch<React.SetStateAction<number | null>>;
}

// 기본값에 타입을 지정합니다.
export const ChatRoomContext = createContext<ChatRoomContextType>({
  chatRoomId: null,
  setChatroomId: () => {},
});

export const ChatRoomProvider = ({ children }: { children: ReactNode }) => {
  const [chatRoomId, setChatroomId] = useState<number | null>(null);

  return (
    <ChatRoomContext.Provider value={{ chatRoomId, setChatroomId }}>
      {children}
    </ChatRoomContext.Provider>
  );
};
