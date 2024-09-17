import { deleteDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { IMessage } from "./chat-timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";
import react, { useState } from "react";

//메시지 내용 보여지는 틀
//왼쪽 오른쪽 나눠서 currentUser 확인 후 배치
type BubbleProps = {
  isCurrentUser: boolean;
  isGPTMessage: boolean;
};
const Bubble = styled.div<BubbleProps>`
  padding: 10px;
  border-radius: 20px;
  background-color: ${(props) => props.isGPTMessage ? "#E0E0E0" : "white"}; // GPT 메시지에 대한 배경색 변경
`;

// 이름 및 채팅 내용
const ChatBubble = styled.div<BubbleProps>`
  display: flex;
  flex-direction: column;
  max-width: 430px;
  margin: 10px;
  align-self: ${(props) => (props.isCurrentUser ? "flex-end" : "flex-start")};
  color: ${(props) => props.isGPTMessage ? "#333" : "black"}; // GPT 메시지에 대한 텍스트 색상 변경
`;

// 유저 이름
const Username = styled.div<BubbleProps>`
  font-weight: bold;
  margin-bottom: 5px;
  text-align: ${(props) => (props.isCurrentUser ? "right" : "left")};
`;

// 입력 시간
const Timestamp = styled.div<BubbleProps>`
  font-size: 10px;
  margin-top: 5px;
  text-align: ${(props) => (props.isCurrentUser ? "right" : "left")};
`;

// 사진
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

/*const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;*/
//추후 사용예정

//출력된 사진 눌렀을 때 확대하기 위한 모달
const ImageModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: white;
  padding: 20px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /* Firefox */
  scrollbar-width: none;
`;

const ImageModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export default function Message({
  username,
  photo,
  message,
  userId,
  id,
  time,
  chatRoomId,
}: IMessage) {
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  // 모달 닫기 함수
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 지우는 기능은 추후 사용 예정
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this message?");
    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "messages", id));
      if (photo) {
        const photoRef = ref(storage, `messages/${user?.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const timestampToDate = time?.toDate(); // Timestamp를 Date 객체로 변환
  const formattedTime = `${String(timestampToDate?.getHours()).padStart(
    2,
    "0"
  )}:${String(timestampToDate?.getMinutes()).padStart(2, "0")}`;

  const isCurrentUser = user?.uid === userId;
  const isGPTMessage = userId === '1'; // GPT 메시지 확인
  return (
    <>
      <ChatBubble isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>
        <Username isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{username}</Username>
        {photo && (
          <Photo
            src={photo}
            alt="Uploaded by user"
            onClick={handleShowModal} // 사진 클릭 이벤트 핸들러를 추가합니다.
          />
        )}
        {!photo && <Bubble isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{message}</Bubble>}{" "}
        {/* Only render the Bubble if no photo is provided */}
        <Timestamp isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{formattedTime}</Timestamp>
      </ChatBubble>

      {/* 이미지를 확대하여 보여주는 모달 */}
      {showModal && (
        <>
          <ChatBubble isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>
            <Username isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{username}</Username>
            {photo && (
              <Photo
                src={photo}
                alt="Uploaded by user"
                onClick={handleShowModal} // 사진 클릭 이벤트 핸들러를 추가합니다.
              />
            )}
            {!photo && <Bubble isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{message}</Bubble>}{" "}
            {/* Only render the Bubble if no photo is provided */}
            <Timestamp isCurrentUser={isCurrentUser} isGPTMessage={isGPTMessage}>{formattedTime}</Timestamp>
          </ChatBubble>

          {/* 이미지를 확대하여 보여주는 모달 */}
          {showModal && (
            <>
              <ImageModalBackground onClick={handleCloseModal} />
              <ImageModal>
                <img
                  src={photo}
                  alt="Zoomed user upload"
                  style={{ width: "100%", height: "auto" }}
                />
              </ImageModal>
            </>
          )}
        </>
      )}
    </>
  );
}
