import { styled } from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { ChatRoomContext } from "./ChatRoomContext";
import { useContext } from "react";
//title은 추가해야 함 채팅방 맨 위를 가리키는 거
//메시지 룸 추가하면서 채팅방 이름 갖게되면 그거에 따라 div에 출력하도록 해야함
export const Title = styled.div`
  height: 100%;
  padding: 20px;
  font-size: 16px;
  color: black;
  background-color: #fbf5ef;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow-y: hidden;
  font-family: "GmarketSansTTFBold";
`;

export default function SendMessageForm() {
  const { chatRoomId } = useContext(ChatRoomContext);
  const [title, setTitle] = useState("");
  const { accessToken } = useContext(AccessTokenContext);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기

    // 토큰이 없다면 추가 작업을 하지 않고 함수를 종료
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
      .get(`http://44.218.133.175:8080/api/v1/chatrooms`, config)
      .then((res) => {

        console.log(res.data.data.chatRoomInfos.title);
        setTitle(res.data.data.chatRoomInfos.title);

      })
      .catch((err) => {
        console.log(err);
      });
  }, [chatRoomId]);
  return <Title>{title}</Title>;
}
