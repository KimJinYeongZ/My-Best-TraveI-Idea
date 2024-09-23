import { styled } from "styled-components";
import React, { useState, useContext } from "react";
import axios from "axios";
import { AccessTokenContext } from "./TokenContext";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { ChatRoomContext } from "./ChatRoomContext";
//초대 /갱신동의 거부 / 타이틀/ 여행일정 /
const Form = styled.form`
  display: flex;
  gap: 10px;
  background-color: white;
  flex-direction: column;
  color: black;
  font-family: "Jalnan2TTF";
  font: bold;
`;
//채팅치는 코드
const TextArea = styled.input`
  height: 30px;
  width: 100%;
  font-size: 16px;
  color: black;
  background-color: white;
  border: 1px solid #b5e2e9;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow-y: hidden;
  &::placeholder {
    font-size: 16px;
  }
`;

const SubmitBtn = styled.button`
  background-color: #b5e2e9;
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

export default function ChatAddForm() {
  const [title, setTitle] = useState("");
  const [spot, setSpot] = useState("");
  const [headcount, setHeadcount] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const onChange_title = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
  };
  const onChange_spot = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSpot(e.target.value);
  };
  const onChange_headcount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeadcount(e.target.value);
  };
  const onChange_start = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
  };
  const onChange_end = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
  };
  const onChange_password = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const { accessToken } = useContext(AccessTokenContext);
  const { setChatroomId } = useContext(ChatRoomContext);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기
    console.log(accessToken);
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
      .post(
        "http://44.218.133.175:8080/api/v1/chatrooms",
        {
          title: title,
          spot: spot,
          headcount: headcount,
          start: start,
          end: end,
          password: password,
        },
        config
      )
      .then((res) => {
        // console.log(res);
        // const createdChatroomId = res.data.data.chatRoomInfos.chatroomId;
        // console.log("Created chatroom ID:", createdChatroomId);
        // setChatroomId(createdChatroomId);
        navigate("/chatrooms");
      })
      .catch((err) => {
        console.log(err);
      });

    // const response = await axios.post(
    //   "http://44.218.133.175:8080/api/v1/chatrooms",
    //   //"http://localhost:3000/api/ v1/chatrooms",
    //   {
    //     title: title,
    //     spot: spot,
    //     headcount: headcount,
    //     start: start,
    //     end: end,
    //     password: password,
    //   },
    //   config
    // );
    //console.log(response.data);
    // setTitle(response.data);
    // setSpot(response.data);
    // setHeadcount(response.data);
    // setStart(response.data);
    // setEnd(response.data);
    // setPassword(response.data);

    // setTitle("");
    // setSpot("");
    // setHeadcount("");
    // setStart("");
    // setEnd("");
    // setPassword("");
  };
  return (
    <>
      <Form onSubmit={onSubmit}>
        채팅방 제목
        <TextArea maxLength={10} onChange={onChange_title} value={title} />
        여행지
        <TextArea maxLength={10} onChange={onChange_spot} value={spot} />
        여행 인원
        <TextArea
          type="number"
          onChange={onChange_headcount}
          value={headcount}
        />
        여행 기간
        <TextArea
          type="date"
          maxLength={180}
          onChange={onChange_start}
          value={start}
        />
        <TextArea
          type="date"
          maxLength={180}
          onChange={onChange_end}
          value={end}
        />
        방 비밀번호
        <TextArea
          type="password"
          maxLength={15}
          onChange={onChange_password}
          value={password}
        />
        <SubmitBtn type="submit">생성하기</SubmitBtn>
      </Form>
    </>
  );
}
