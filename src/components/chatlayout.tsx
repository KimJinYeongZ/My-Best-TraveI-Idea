import { Outlet, Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import react, { useState } from "react";
import axios from "axios";

const PlanContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

// 각 메뉴 아이템을 위한 스타일
const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
  }
`;

const C = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80%;
`;

// MBTI 박스를 위한 스타일
const MBTIBlock = styled.div`
  font-family: "Gluten", cursive;
  background-color: white;
  color: black;
  text-align: center;
  padding: 20px;
  font-size: 2em;
`;
const RefreshButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ddd;
  height: 40px;
  width: 40px;
  margin-right: 15px;
  border-radius: 50%;
`;

const DayPlanContainer = styled.div`
  font-family: "Jalnan2TTF";
  align-items: center;
  justify-content: center;
  //margin-left: 0px;
  color: black;
`;

const DayButton = styled.button`
  background-color: white;
  border: none;
  font-size: 2em;
  margin: 0 10px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // 수평 정렬
  justify-content: center;
  margin-top: 30px;
  gap: 20px; // 버튼 사이의 간격
`;

const DayPlanItem = styled.li`
  font-family: "Jalnan2TTF";
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const VoteResultRadio = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  label {
    margin: 0 10px;
    font-size: 1em;
    color: #333;
    display: flex;
    align-items: center;
  }

  input[type="radio"] {
    vertical-align: middle;
    appearance: none;
  }

  // 커스텀 라디오 버튼 디자인
  input[type="radio"]:after {
    width: 15px;
    height: 15px;
    transition: border 0.5s ease-in-out;
    border-radius: 15px;
    position: relative;
    background-color: white;
    content: "";
    display: inline-block;
    visibility: visible;
    border: max(2px, 0.1em) solid gray;
  }

  input[type="radio"]:checked:after {
    background-color: #f2bdaf;
  }
  input[type="radio"]:hover {
    cursor: pointer;
  }
`;

// 제출하기 버튼
const StyledButton = styled.button`
  font-family: "Jalnan2TTF";
  background-color: #f1d19d; // 배경색
  color: black; // 텍스트 색상
  padding: 15px 32px; // 안쪽 여백
  border: none; // 테두리 없음
  border-radius: 30px; // 모서리 둥글게
  cursor: pointer; // 마우스 오버 시 커서 변경
  font-size: 16px; // 폰트 크기
  display: inline-block;
  justify-content: flex-start;
  align-items: center;
  /* &:hover {
    background-color: #d8c19d; // 호버 시 배경색 변경
  } */
`;

export default function Layout() {
  const navigate = useNavigate();
  const [day, setDay] = useState(1);
  const [voteResult, setvoteResult] = useState({});
  const [isCompleted, setIsCompleted] = useState(false); // true 일때만 완료 버튼이 보임
  const [roomManagerUid, setRoomManagerUid] = useState(null); // 방장의 uid를 저장할 상태

  const onLogOut = async () => {
    const ok = confirm("Are you sure you want to log out?");
    if (ok) {
      await auth.signOut();
      navigate("/login");
    }
  };

  const handleNextDay = () => {
    setDay((prevDay) => prevDay + 1);
  };

  // 이전 일자로 이동
  const handlePrevDay = () => {
    setDay((prevDay) => (prevDay > 1 ? prevDay - 1 : 1));
  };

  // 라디오 버튼 변경시 호출될 이벤트 핸들러
  const handleRadioChange = (destination: string, value: string) => {
    setvoteResult((prevvoteResult) => ({
      ...prevvoteResult,
      [destination]: value,
    }));
  };

  // 제출 버튼 클릭시 호출될 이벤트 핸들러
  const handleSubmit = async () => {
    // 여기서 voteResult 상태를 서버로 전송
    //  await axios.post("http://44.218.133.175:8080/api/v1/chatrooms/{chatroomId}/agree/{memberId}", voteResult);
    console.log("Submitted data:", voteResult);
  };

  // RefreshButton 클릭 시 호출될 이벤트 핸들러
  const handleRefresh = async () => {
    try {
      const chatroomId = "your_chatroom_id"; // 받아온 chatroomId로 교체
      const response = await axios.get(
        `http://44.218.133.175:8080/api/v1/chatrooms/${chatroomId}/recommendation`
      );
      console.log(response.data); // 여기서 받은 데이터를 처리
      // 예: 상태 업데이트 또는 화면에 표시 등

      // 서버로부터 받은 isCompleted 값을 상태에 설정
      setIsCompleted(response.data.isCompleted);
      // 방장의 uid를 상태에 저장
      setRoomManagerUid(response.data.roomManager);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleConfirm = () => {
    // 이 곳에 여행지 확정 버튼 클릭시 넘겨줄 데이터 전송
    navigate("/History"); // '/History' 경로로 이동
  };

  // Firebase에서 현재 사용자의 uid를 가져오는 로직 (예시: 현재 로그인한 사용자의 uid)
  const currentUserId = auth.currentUser?.uid;

  return (
    <>
      <Link to="/">
        <MenuItem>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </MenuItem>
      </Link>
      {/* <MenuContainer>
        <Link to="/">
          <MenuItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </MenuItem>
        </Link>
        <Link to="/profile">
          <MenuItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </MenuItem>
        </Link>
        <Link to="/survey">
          <MenuItem>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              stroke="black"
              strokeWidth={0.5}
              className="bi bi-check-square"
              viewBox="0 0 16 16"
            >
              <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
              <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z" />
            </svg>
          </MenuItem>
        </Link>

        <MenuItem onClick={onLogOut} className="log-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </MenuItem>
      </MenuContainer> */}

      <Outlet />
      <C>
        <MBTIBlock>
          <MBTIBlock>MBTI</MBTIBlock>
        </MBTIBlock>

        <DayPlanContainer>
          <PlanContainer>
            <RefreshButton onClick={handleRefresh}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
                />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
              </svg>
            </RefreshButton>
            <DayButton onClick={handlePrevDay}>&lt;</DayButton>
            {day}일차
            <DayButton onClick={handleNextDay}>&gt;</DayButton>
            만족&nbsp;&nbsp;불만족
          </PlanContainer>
          <PlanContainer>
            <ul>
              {[
                "여행 추천지1",
                "여행 추천지2",
                "여행 추천지3",
                "여행 추천지4",
                "여행 추천지5",
              ].map((destination, index) => (
                <DayPlanItem key={index}>
                  {day}일차 {destination}
                  <VoteResultRadio>
                    <label>
                      <input
                        type="radio"
                        name={`voteResult-${destination}`}
                        value="true"
                        onChange={() =>
                          handleRadioChange((index + 1).toString(), "true")
                        }
                      />
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`voteResult-${destination}`}
                        value="false"
                        onChange={() =>
                          handleRadioChange((index + 1).toString(), "false")
                        }
                      />
                    </label>
                  </VoteResultRadio>
                </DayPlanItem>
              ))}
            </ul>
          </PlanContainer>
          <ButtonContainer>
            <StyledButton type="submit" onClick={handleSubmit}>
              여행지 만족도 제출
            </StyledButton>
            {isCompleted && roomManagerUid === currentUserId && (
              <StyledButton type="submit" onClick={handleConfirm}>
                여행지 확정
              </StyledButton>
            )}
          </ButtonContainer>
        </DayPlanContainer>
      </C>
    </>
  );
}
