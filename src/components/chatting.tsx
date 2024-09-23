import { styled } from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ChatRoomContext } from "./ChatRoomContext";
import { useContext } from "react";
// 파일 아이콘 + 전송 아이콘 컨테이너 css
const Form = styled.form`
  display: flex;
  flex-direction: row;
  gap: 10px;
  background-color: #fbf5ef;
`;

// 채팅 메세지 입력 css
const TextArea = styled.textarea`
  height: 100%;
  width: 100%;
  padding: 20px;
  font-size: 16px;
  color: black;
  background-color: #fbf5ef;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  overflow-y: hidden;
  &::placeholder {
    font-size: 16px;
  }
  border: none;
  &:focus {
    outline: none; // 기본 아웃라인 제거
    border-color: #fbf5ef; // 원하는 테두리 색상 설정. 여기서는 배경색과 동일하게 설정하였음.
  }
`;

// 파일 아이콘 css
const AttachFileButton = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin-top: 7px;
  margin-right: 3px;
  color: black;
`;

const AttachFileInput = styled.input`
  display: none;
`;

// 전송 아이콘 css
const SubmitBtn = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin-top: 7px;
  margin-right: 3px;
  background-color: #fbf5ef;
  border: none;
`;

// 파일(이미지) 선택시 전송, 취소 버튼 뜨는 창 css
//파일,즉 사진 입력할 때 전송할 건지, 취소할 건지 모달이 뜨는 것
const ImagePreviewModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 20px;
  z-index: 1000;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2); // 그림자 추가
  width: 80%; // 모달의 최대 너비 설정
  max-width: 500px; // 모달의 최대 너비 제한
  text-align: center; // 내용 중앙 정렬
  display: flex; // Flexbox 적용
  flex-direction: column; // 수직 방향 배치
  justify-content: space-between; // 위아래 내용 간격 최대화
  align-items: flex-start; // 수평 방향에서 시작 지점에 정렬
`;

// 버튼 컨테이너
const ButtonContainer = styled.div`
  display: flex; // Flexbox 적용
  gap: 10px; // 버튼 간의 간격
`;

//전송 버튼, 취소버튼
const PreviewButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 15px;
  margin: 10px 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background-color: #0056b3;
  }
`;

// 모달 뜰 때 뒷 배경 어둡게
// 모달 뜰 때 오버레이
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

export default function SendMessageForm() {
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // 이미지 미리보기를 위한 상태 변수
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 표시 상태 변수
  const { chatRoomId } = useContext(ChatRoomContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === "string") {
          setPreview(event.target.result); // 이미지 미리보기를 위한 URL 설정
        }
        setIsModalOpen(true);
      };
      reader.readAsDataURL(files[0]);
    }
  };
  const onModalSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (isLoading || !file) return; // 여기서는 file만 확인합니다.

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "messages"), {
        createdAt: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user?.uid,
        time: new Date(),
        type: "image",
        chatRoomId: chatRoomId,
      });

      if (file) {
        const locationRef = ref(storage, `messages/${user?.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setFile(null);
      setPreview(null);
      setIsModalOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const onModalCancel = () => {
    setIsModalOpen(false);
    setPreview(null);
    setFile(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 줄바꿈을 방지합니다.
      onSubmit(e as any); // 메시지 전송 로직을 실행합니다.
    }
  };

  // 전송
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (isLoading || message === "" || message.length > 180) return;

    try {
      setLoading(true);
      const doc = await addDoc(collection(db, "messages"), {
        message,
        createdAt: Date.now(),
        username: user?.displayName || "Anonymous",
        userId: user?.uid,
        time: new Date(),
        type: "text",
        chatRoomId: chatRoomId,
      });
      if (file) {
        const locationRef = ref(storage, `messages/${user?.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setMessage("");
      setFile(null);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Form onSubmit={onSubmit}>
        <TextArea
          required
          rows={5}
          maxLength={180}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          value={message}
          placeholder="메세지 입력 ..."
        />
        <AttachFileButton htmlFor="file">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            ></path>
          </svg>
        </AttachFileButton>
        <AttachFileInput
          onChange={onFileChange}
          type="file"
          id="file"
          accept="image/*"
        />
        <SubmitBtn type="submit">
          <svg
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            ></path>
          </svg>
        </SubmitBtn>
      </Form>
      {isModalOpen && (
        <>
          <Overlay onClick={onModalCancel} />
          <ImagePreviewModal>
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  marginBottom: "10px",
                }}
              />
            ) : null}
            <ButtonContainer>
              <PreviewButton onClick={onModalSubmit}>전송</PreviewButton>
              <PreviewButton
                onClick={onModalCancel}
                style={{ backgroundColor: "#DC3545", borderColor: "#C82333" }} // 취소 버튼 css
              >
                취소
              </PreviewButton>
            </ButtonContainer>
          </ImagePreviewModal>
        </>
      )}
    </>
  );
}
