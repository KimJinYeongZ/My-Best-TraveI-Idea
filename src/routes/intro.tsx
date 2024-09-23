import { Outlet, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import react, { useState } from "react";

// 왼쪽 틀
const Lay = styled.div`
  width: 25%;
  // 가운데 정렬
  display: flex;
  flex-direction: column;
  //justify-content: center; // 수직 가운데 정렬
  align-items: center; // 수평 가운데 정렬
`;
// 오른쪽 틀
const Divs = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 75%;
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
  font-size: 7em;
  margin-top: 100px;
`;
// 왼쪽 배경
const Background_left = styled.div`
  background-image: url("/paper_plane.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  width: 100%;
  height: 100%;
`;

// 오른쪽 배경
const Background_right = styled.div`
  background-image: url("/solar_cloud-linear.svg");
  background-size: cover;
  width: 100%;
  height: 100%;
`;

// 이미지 + 함께하기 컨테이너
const MBTIContainer = styled.div`
  height: 70%;
  width: 100%;
  // 가운데 정렬
  display: flex;
  flex-direction: column;
  justify-content: center; // 수직 가운데 정렬
  align-items: center; // 수평 가운데 정렬
`;

// MBTI와 함께하기 버튼
const StyledButton = styled.button`
  background-color: #f2bdaf; // 배경색
  color: black; // 텍스트 색상
  padding: 20px 40px; // 안쪽 여백
  border: none; // 테두리 없음
  border-radius: 30px; // 모서리 둥글게
  width: 100%;
  height: 40%;
  cursor: pointer; // 마우스 오버 시 커서 변경
  font-family: "Jalnan2TTF";
  font-size: 1.5rem; // 폰트 크기
  margin-bottom: 100px;
  &:hover {
    background-color: #d3a599; // 호버 시 배경색 변경
  }
`;


export default function Navigation() {

  return (
    <>
      <Lay>
        <MBTIBlock>MBTI</MBTIBlock>
        <MBTIContainer>
          <Background_left />
          <Link to="/login">
            <StyledButton>MBTI와 함께하기</StyledButton>
          </Link>
        </MBTIContainer>
      </Lay>
      <Divs>
        <Background_right />
      </Divs>
      <Outlet />
    </>
  );
}
