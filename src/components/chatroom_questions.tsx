import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { AccessTokenContext } from "../components/TokenContext";
import { useNavigate } from "react-router-dom";
import { ChatRoomContext } from "./ChatRoomContext";
// 스타일 컴포넌트 정의 부분...

// 질문 제목
const QuestionTitle = styled.h3`
  font-family: "GmarketSansTTFBold";
  font-size: 24px; // 폰트 크기
  color: #333; // 폰트 색상
  margin-left: 30px;
  margin-bottom: 8px; // 제목 아래 여백
`;

// 선택지 컨테이너
const OptionsContainer = styled.div`
  display: flex; // flex 레이아웃 사용
  flex-direction: column; // 가로 방향 배열
  justify-content: start; // 왼쪽 정렬
  margin-top: 2%;
  margin-bottom: 1%; // 컨테이너 하단 여백
`;

// 선택지
const OptionLabel = styled.label`
  display: block; // 블록 레벨 요소로 변경
  margin-top: 10px; // 각 옵션 사이의 여백
  font-family: "GmarketSansTTFLight";
  font-size: 16px; // 폰트 크기
  color: black;
  cursor: pointer; // 마우스 오버 시 커서 변경
`;

// 선택지 버튼
const RadioBoxInput = styled.input`
  width: 15px;
  height: 15px;
`;

// 제출하기 버튼
const StyledButton = styled.button`
  background-color: #b5e2e9; // 배경색
  color: black; // 텍스트 색상
  padding: 15px 32px; // 안쪽 여백
  border: none; // 테두리 없음
  border-radius: 30px; // 모서리 둥글게
  cursor: pointer; // 마우스 오버 시 커서 변경
  font-family: "Jalnan2TTF";
  font-size: 16px; // 폰트 크기
  margin-top: 30px;
  margin-left: 30px;

  /* &:hover {
    background-color: #9dd0d8; // 호버 시 배경색 변경
  } */
`;
const QuestionText = styled.span`
  // background-color: #cdecf0; // 형광펜 효과를 위한 배경색
  color: black;
  padding: 3px; // 텍스트 주변에 여백을 추가
`;

interface ProgressBarProps {
  width: number;
}

const ProgressBarContainer = styled.div`
  width: 80%;
  background-color: #e0e0e0;
  border-radius: 20px;
  margin: 30px;
`;

const ProgressBar = styled.div<ProgressBarProps>`
  height: 20px;
  background-color: #4ca34d;
  border-radius: 20px;
  width: ${(props) => props.width}%;
  transition: width 0.3s ease-in-out;
`;

interface Question {
  id: number;
  text: string;
  options: string[];
  selectedOption: string;
}

const QUESTIONS_PER_PAGE = 2;
const TOTAL_PAGES = 5;

const Chatroom_Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const progressBarWidth = ((currentPage + 1) / TOTAL_PAGES) * 100;
  const { accessToken } = useContext(AccessTokenContext);
  const navigate = useNavigate();
  const { chatRoomId } = useContext(ChatRoomContext);

  console.log(chatRoomId + "!!");
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
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
      //.get("http://localhost:4000/api/v1/chatrooms/survey/1")
      .get("http://44.218.133.175:8080/api/v1/chatrooms/survey/1", config)
      .then((response) => {
        const surveyData = response.data.data.survey;
        console.log(response.data.data.survey);
        const loadedQuestions = Object.keys(surveyData).map((key, index) => {
          // 값이 문자열인지 확인하고, 아니라면 문자열로 변환
          const options =
            typeof surveyData[key] === "string"
              ? surveyData[key].split(",")
              : String(surveyData[key]).split(",");
          return {
            id: index + 1,
            text: key,
            options: options,
            selectedOption: "",
          };
        });
        setQuestions(loadedQuestions);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [accessToken]);

  const handleAnswerChange = (questionId: number, selectedOption: string) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId ? { ...question, selectedOption } : question
    );
    setQuestions(updatedQuestions);
  };

  const isPageComplete = () => {
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return questions
      .slice(startIndex, endIndex)
      .every((q) => q.selectedOption !== "");
  };

  const allAnswered = questions.every(
    (question) => question.selectedOption !== ""
  );

  const handleNextPage = () => {
    if (currentPage < TOTAL_PAGES - 1) setCurrentPage(currentPage + 1);
  };

  const handleSubmit = () => {
    const accessToken = localStorage.getItem("accessToken");
    // 토큰이 없다면 추가 작업을 하지 않고 함수를 종료
    if (!accessToken) {
      console.log("No token found");
      return;
    }

    // 데이터 제출 로직
    const result = questions
      .map((question) => question.selectedOption)
      .join(",");

    const postData = {
      result,
      version: 1,
      chatRoomId: chatRoomId, // 실제 chatRoomId를 가져오도록 변경해야함
    };

    console.log("result: ", postData.result);
    console.log("version: ", postData.version);
    console.log("chatRoomId: ", postData.chatRoomId);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    // 데이터를 서버에 POST
    axios
      .post(
        "http://44.218.133.175:8080/api/v1/chatrooms/survey",
        //"http://localhost:4000/api/v1/chatrooms/survey/1",
        JSON.stringify(postData), // 데이터를 JSON 문자열로 변환
        config
      )
      .then((response) => {
        console.log("서버 응답:", response);
        // 성공적으로 제출되었을 때의 추가 동작(옵션)
        navigate("/chatrooms");
      })
      .catch((error) => {
        console.error("Error posting data: ", error);
        console.log(accessToken);
      });
  };

  return (
    <div>
      {/* ProgressBar와 질문 목록 */}
      <ProgressBarContainer>
        <ProgressBar width={progressBarWidth} />
      </ProgressBarContainer>
      {questions
        .slice(
          currentPage * QUESTIONS_PER_PAGE,
          (currentPage + 1) * QUESTIONS_PER_PAGE
        )
        .map((question) => (
          <QuestionTitle key={question.id}>
            <p>
              <QuestionText>
                Q{question.id}. {question.text}
              </QuestionText>
            </p>
            {question.options.map((option) => (
              <OptionLabel key={option}>
                <RadioBoxInput
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={question.selectedOption === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                />
                {option}
              </OptionLabel>
            ))}
          </QuestionTitle>
        ))}
      {currentPage < TOTAL_PAGES - 1 && (
        <StyledButton onClick={handleNextPage} disabled={!isPageComplete()}>
          다음
        </StyledButton>
      )}
      {currentPage === TOTAL_PAGES - 1 && (
        <StyledButton onClick={handleSubmit} disabled={!allAnswered}>
          제출
        </StyledButton>
      )}
    </div>
  );
};

export default Chatroom_Questions;
