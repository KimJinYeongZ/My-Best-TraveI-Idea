import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import ChatRoom from "./chatroomslist-title";
import { AccessTokenContext } from "./TokenContext";
export interface ChatRoom {
  chatroomId: number;
  title: string;
  chatroomStatus: string;
}

const Wrapper = styled.div`
  display: flex;
  overflow-y: auto; // 스크롤 가능하게 합니다.
  flex-direction: column;
  height: 80%;
  width: 100%;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
`;
const exampleData1 = {
  chatroomId: 1,
  title: "완도 가자",
  chatroomStatus: "참여하기",
};
export default function Chatroomlist() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  //const { accessToken } = useContext(AccessTokenContext);
  const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기
  console.log("현재 토큰(챗룸타임라인): " + accessToken);

  useEffect(() => {
    if (!accessToken) {
      console.log("No token found");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    axios
      .get("http://44.218.133.175:8080/api/v1/chatrooms", config)
      .then((res) => {
        if (Array.isArray(res.data.data.chatRoomInfos)) {
          setChatRooms(res.data.data.chatRoomInfos);
        } else {
          console.log("Data is not an array:", res.data.data.chatRoomInfos);
          localStorage.setItem(
            "accessTitle",
            res.data.data.chatRoomInfos.title
          ); // 채팅방 제목 저장
          // 적절한 오류 처리 로직을 추가하세요.
        }
      })
      .catch((err) => {
        console.log("에러" + err);
      });
  }, [accessToken]);

  return (
    <Wrapper>
      {chatRooms.map((chatroom) => (
        <ChatRoom key={chatroom.chatroomId} {...chatroom} />
      ))}
    </Wrapper>
  );
}
