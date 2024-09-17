import { Outlet, Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../firebase";
import react, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ChatRoomContext } from "./ChatRoomContext";

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

const OptionsContainer = styled.div`
  color: gray;
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

const DestinationHighlight = styled.span`
  background-color: #f1d19d;
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
  const [voteResult1, setvoteResult] = useState({});
  const [isCompleted, setIsCompleted] = useState(true); // true 일때만 완료 버튼이 보임
  const [ManagerId, setManagerId] = useState(null); // 방장의 uid를 저장할 상태
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [spots, setSpots] = useState([]); // 여행지 데이터를 저장할 상태 변수
  const { chatRoomId } = useContext(ChatRoomContext);

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
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기
    console.log(accessToken);

    // 토큰이 없다면 추가 작업을 하지 않고 함수를 종료
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

    const voteResult = Object.entries(voteResult1)
      .map(([key, value]) => `${value}`)
      .join(",");

    console.log("voteResult: ", voteResult);
    console.log("chatRoomId: ", chatRoomId);
    const response = await axios.post(
      `http://44.218.133.175:8080/api/v1/chatrooms/${chatRoomId}/agree`,
      voteResult,
      config
    );
    console.log("post 결과:", response);
  };

  // RefreshButton 클릭 시 호출될 이벤트 핸들러
  const handleRefresh = async () => {
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

    try {
      const response = await axios.get(
        //`http://44.218.133.175:8080/api/v1/chatrooms/${chatroomId}/recommendation`
        `http://44.218.133.175:8080/api/v1/chatrooms/${chatRoomId}/recommendation`,
        config
      );

      setSpots(response.data.data.spots); // 여기서 받은 여행지 데이터를 상태에 저장

      console.log(response.data); // 여기서 받은 데이터를 처리
      // 예: 상태 업데이트 또는 화면에 표시 등

      // 서버로부터 받은 isCompleted 값을 상태에 설정
      console.log("completed 값: ", response.data.data.completed);
      setIsCompleted(response.data.data.completed);
      // 방장의 memberid를 상태에 저장
      console.log("방장의 memberId: ", response.data.data.managerId);
      setManagerId(response.data.data.managerId);
      // 현재 유저의 memberid를 상태에 저장
      console.log("현재 유저의 memberId: ", response.data.data.currentMemberId);
      setCurrentMemberId(response.data.data.currentMemberId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleConfirm = () => {
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기
    console.log(accessToken);
    // 토큰이 없다면 추가 작업을 하지 않고 함수를 종료
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
    // 이 곳에 여행지 확정 버튼 클릭시 넘겨줄 데이터 전송
    axios
      .post(
        `http://44.218.133.175:8080/api/v1/chatrooms/${chatRoomId}/finish`,
        //"http://localhost:4000/api/v1/members/survey/1",
        chatRoomId,
        config
      )
      .then((response) => {
        // console.log("서버 응답:", response);
        // // 성공적으로 제출되었을 때의 추가 동작(옵션)
        // navigate("/chatrooms");
        console.log(response);
      })
      .catch((error) => {
        console.error("Error posting data: ", error);
      });

    navigate("/History"); // '/History' 경로로 이동
  };

  useEffect(() => {
    // 채팅방 입장시 refresh 버튼 한번 누르도록 설정
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스토큰 불러오기
    handleRefresh();
  }, []);

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
              {spots.map((destination, index) => (
                <DayPlanItem key={index}>
                  {day}일차{" "}
                  <DestinationHighlight>{destination}</DestinationHighlight>
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
            {isCompleted && ManagerId === currentMemberId && (
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
