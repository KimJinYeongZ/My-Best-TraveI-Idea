import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ChatRoomContext } from "./ChatRoomContext";

const Wrapper = styled.div`
  display: flex;
  color: black;

  width: 100%;
  margin-bottom: 50px;
  margin-top: 10px;
  margin-left: 10px;
`;
const Title = styled.div`
  border-bottom: 2px solid #b5e2e9;
  width: 80%;
  font-family: "Jalnan2TTF";
`;

type StatusProps = {
  status: string;
};
const getStatusColor = (status: string): string => {
  switch (status) {
    case "WAITING":
      return "#968f8d";
    case "SURVEY":
      return "#F2BDAF";
    case "COMPLETE":
      return "#B5E2E9";
    default:
      return "#f2bdaf";
  }
};

const getHoverStatusColor = (status: string): string => {
  switch (status) {
    case "SURVEY":
      return "#E6B4A5"; // SURVEY 상태의 hover 색상
    case "COMPLETE":
      return "#9FD1DC"; // COMPLETE 상태의 hover 색상
    default:
      return getStatusColor(status); // 다른 상태에서는 기본 색상 사용
  }
};
const Status = styled.div<StatusProps>`
  background-color: ${(props) => getStatusColor(props.status)};
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
  font-family: "Jalnan2TTF";
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const getStatusText = (status: string): string => {
  switch (status) {
    case "WAITING":
      return "대기 중";
    case "SURVEY":
      return "설문 조사";
    case "COMPLETE":
      return "참여하기";
    default:
      return status; // 기본적으로 상태 값을 그대로 반환
  }
};
const ParticipateButton = styled.button<StatusProps>`
  // 버튼 스타일
  background-color: ${(props) => getStatusColor(props.status)};
  color: black;
  padding: 10px 15px;
  border: none;
  border-radius: 30px;
  font-family: "Jalnan2TTF";
  width: 100px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => getHoverStatusColor(props.status)};
  }
`;
const ShareButton = styled.button`
  background-image: url("/sharebutton.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  width: 30px;
  height: 30px;
  border: none;
  background-color: white;
`;

export interface ChatRoom {
  chatroomId: number;
  title: string;
  chatroomStatus: string;
}

export default function ChatRoomComponent({
  chatroomId,
  title,
  chatroomStatus,
}: ChatRoom) {
  const { setChatroomId } = useContext(ChatRoomContext);
  const navigate = useNavigate();

  const handleJoinChat = () => {
    setChatroomId(chatroomId);
    console.log("채팅방에 참여합니다!", chatroomId);
    if (chatroomStatus === "SURVEY") navigate(`/chatrooms-survey`);
    else if (chatroomStatus === "COMPLETE") navigate(`/chat`);
  };

  const handleShareChat = () => {
    setChatroomId(chatroomId);
    const chatroomLink = `http://localhost:3000/invite/${chatroomId}`;
    navigator.clipboard
      .writeText(chatroomLink)
      .then(() => {
        console.log("채팅방 링크가 클립보드에 복사되었습니다:", chatroomLink);
        alert("채팅방 링크가 클립보드에 복사되었습니다.");
      })
      .catch((err) => {
        console.error("링크 복사에 실패했습니다:", err);
        alert("링크 복사에 실패했습니다");
      });
  };

  return (
    <Wrapper>
      <Title>{title}</Title>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ShareButton onClick={handleShareChat} />
        {chatroomStatus === "SURVEY" || chatroomStatus === "COMPLETE" ? (
          <ParticipateButton status={chatroomStatus} onClick={handleJoinChat}>
            {getStatusText(chatroomStatus)} {/* 상태에 따른 텍스트 표시 */}
          </ParticipateButton>
        ) : (
          <Status status={chatroomStatus}>
            {getStatusText(chatroomStatus)}
          </Status>
        )}
      </div>
    </Wrapper>
  );
}
