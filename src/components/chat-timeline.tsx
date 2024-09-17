import {
  Firestore,
  Timestamp,
  Unsubscribe,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Message from "./chat-message";
import React, { useContext } from "react";
import { ChatRoomContext } from "./ChatRoomContext";
//메시지 타임라인, 즉 틀 이야기하는 거
export interface IMessage {
  id: string;
  photo?: string;
  message: string;
  userId: string;
  username: string;
  createdAt: number;
  time: Timestamp;
  chatRoomId: number;
}

// height = 465px -> calc(100vh - 250px) 변경 -> 반응형?
const Wrapper = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto; // 스크롤 가능하게 합니다.
  height: 100%;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
`;

export default function Timeline() {
  const [messages, setMessage] = useState<IMessage[]>([]);
  const { chatRoomId } = useContext(ChatRoomContext);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchMessages = async () => {
      const q = collection(db, "messages");

      console.log("챗룸아이디 입력됨");
      console.log(chatRoomId);
      
      const messagesQuery = query(
        q,
        where("chatRoomId", "==", chatRoomId),
        orderBy("createdAt", "desc")
      );

      unsubscribe = await onSnapshot(messagesQuery, (snapshot) => {
        const messages = snapshot.docs.map((doc) => {
          const {
            message,
            createdAt,
            userId,
            username,
            photo,
            time,
            chatRoomId,
          } = doc.data();
          return {
            message,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
            time,
            chatRoomId,
          };
        });

        console.log(messages); // 임시로 콘솔에 결과를 출력합니다.
        setMessage(messages);
      });
    };
    
    fetchMessages();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [chatRoomId]); // 의존성 배열에 chatroomId를 추가합니다.

  return (
    <Wrapper>
      {messages.map((message) => (
        <Message key={message.id} {...message} />
      ))}
    </Wrapper>
  );
}
