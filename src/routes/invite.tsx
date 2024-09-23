import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Invite = () => {
  const { chatroomId } = useParams();
  const chatroomIdNumber = parseInt(chatroomId ?? " ", 10);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태

  useEffect(() => {
    if (!accessToken) {
      console.log("No token found");
      return;
    }

    const password = prompt("채팅방에 접근하기 위한 비밀번호를 입력하세요.");
    if (!password) {
      alert("비밀번호 입력이 취소되었습니다."); 
      return;
    }

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    (async () => {
      try {
        const response = await axios.post(
          `http://44.218.133.175:8080/api/v1/chatrooms/${chatroomIdNumber}/invite`,
          { password },
          config
        );
        navigate("/chatrooms");
      } catch (error) {
        // 서버에서의 오류 응답을 처리
        alert("비밀번호가 틀렸습니다."); 
        navigate("/chatrooms");
      }
    })();
  }, [chatroomIdNumber, accessToken, navigate]);

  return (
    <div>
      <h1>채팅방 초대 페이지</h1>
      {errorMessage && <p>{errorMessage}</p>}
      <p>채팅방 ID: {chatroomIdNumber}</p>
    </div>
  );
};

export default Invite;
