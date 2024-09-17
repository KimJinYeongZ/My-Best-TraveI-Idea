import React from "react";
import styled from "styled-components";
import ChatRoomlistTimeline from "../components/chatroomslist-timeline";
import { Outlet, Link, useNavigate } from "react-router-dom";
import ChatAddForm from "../components/chatadd";
const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 130px;
  padding: 20px;
  width: 20%;
  position: fixed; // 상단에 고정
  top: 0; // 상단에서 0의 위치에
  left: 0; // 오른쪽에서 0의 위치에
  margin-left: auto; // 왼쪽 마진을 자동으로 설정하여 오른쪽 정렬
  z-index: 1000; // 다른 요소들 위에 오도록 z-index 설정
  height: 20%;
  color: black;
  font-size: 4em;
  font-family: "Gluten", cursive;
`;

const ChatAddDiv = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-30%, -40%);
  width: 55%;
  height: 75%;
  flex-direction: column;
`;
const StyledLink = styled(Link)`
  text-decoration: none; // 밑줄 제거
  color: black; // 텍스트 색상 변경
`;

const ChatAdd = () => {
  return (
    <>
      <TitleContainer>Talk</TitleContainer>
      <ChatAddDiv>
        <ChatAddForm />
      </ChatAddDiv>
    </>
  );
};

export default ChatAdd;
