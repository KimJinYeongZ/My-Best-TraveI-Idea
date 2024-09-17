import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Chatroomlist from "../components/chatroomslist-timeline";
import { ChatRoomContext } from "../components/ChatRoomContext";

const Invite = () => {
  const { chatroomId } = useParams();
  const chatroomIdNumber = parseInt(chatroomId ?? " ", 10);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (!accessToken) {
      console.log("No token found");
      return;
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    console.log(accessToken);
    console.log(chatroomIdNumber);

    const password = prompt("채팅방에 접근하기 위한 비밀번호를 입력하세요.");

    if (password) {
      console.log(chatroomIdNumber + "!!");
      console.log(password + "!!");
      (async () => {
        try {
          // axios.post를 await로 처리

          const response = await axios.post(
            `http://44.218.133.175:8080/api/v1/chatrooms/${chatroomIdNumber}/invite`,
            {
              password: password,
            },
            config
          );
          console.log("asd");
          console.log("서버 응답:", response.data);
          //navigate("/chat");

          // 성공 처리 로직
        } catch (error) {
          console.error("서버 요청 실패:", error);
          // 오류 처리 로직
        }
      })();
    } else {
      console.log("비밀번호 입력이 취소되었습니다.");
    }
  }, [chatroomIdNumber]);

  return (
    <div>
      <h1>채팅방 초대 페이지</h1>
      <p>채팅방 ID: {chatroomIdNumber}</p>
    </div>
  );
};

export default Invite;
