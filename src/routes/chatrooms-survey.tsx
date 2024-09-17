import "../App.tsx";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import Chatroom_Questions from "../components/chatroom_questions";

// 왼쪽 틀
const Lay = styled.div`
  width: 35%;
  border-right: 1.5px solid gray;
  // 가운데 정렬
  display: flex;
  flex-direction: column;
  justify-content: center; // 수직 가운데 정렬
  align-items: center; // 수평 가운데 정렬
`;

// 오른쪽 틀
const Divs = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 65%;
  height: 100%;
  color: black;
  font-size: 20px;
  // 가운데 정렬
  display: flex;
  flex-direction: column;
  justify-content: center; // 수직 가운데 정렬
  //align-items: center; // 수평 가운데 정렬
`;

// MBTI 박스를 위한 스타일
const MBTIBlock = styled.div`
  align-items: center;
  font-family: "Gluten", cursive;
  background-color: white;
  color: black;
  text-align: center;
  padding: 20px;
  font-size: 100px;
`;

// 설문조사 설명
const Survey_explain = styled.div`
  color: black;
  font-family: "GmarketSansTTFMedium";
  font-size: 25px;
  text-align: center;
  margin-top: 200px;
  list-style: none;
  line-height: 150%;
`;

export default function Survey() {
  return (
    <>
      <Lay>
        <MBTIBlock>MBTI</MBTIBlock>
        <Survey_explain>
          <li>보다 만족스러운 계획을 위해</li>
          <li>자신의 성향을 기록해주세요</li>
        </Survey_explain>
      </Lay>
      <Divs>
        <Chatroom_Questions />
      </Divs>
    </>
  );
}
