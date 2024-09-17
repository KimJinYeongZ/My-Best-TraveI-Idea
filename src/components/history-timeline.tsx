import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import axios from "axios";

import HistoryID from "./history";
import { AccessTokenContext } from "./TokenContext";
export interface HistoryID {
  id: string;
  userId: string;
  title: string;
}
const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  height: 90%;
  width: 100%;

  & > div {
    flex: 0 0 45%;
    box-sizing: border-box;
    padding: 10px;
    border: 3px solid black;
    margin: 10px; // 마진 추가
    height: 50%;
    width: 100%;
    border-radius: 10px;
    position: relative;
  }

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

export default function Chatroomlist() {
  const [historyID, setHistoryID] = useState<HistoryID[]>([]);
  const accessToken = localStorage.getItem("accessToken");

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
    console.log(accessToken);

    axios.get("http://44.218.133.175:8080/api/v1/history", config)
      .then((res) => {
        if (Array.isArray(res.data.data.histories)) {
          console.log(res.data);
          setHistoryID(res.data.data.histories);
        } else {
          console.log('Data is not an array:', res.data);
          // 적절한 오류 처리 로직을 추가하세요.
        }
      })
      .catch((err) => {
        console.log(err);
      });
  },[]);
 

  return (
    <Wrapper>
      {historyID.map((history) => (
        <HistoryID key={history.id} {...history} />
      ))}
    </Wrapper>
  );
}
