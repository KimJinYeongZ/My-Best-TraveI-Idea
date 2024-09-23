import { styled } from "styled-components";

// 이메일 비밀번호 로그인 컨테이너?
export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
`;

// 제목 css - 제목 내용은 없는듯
export const Title = styled.h1`
  color: black;
  font-family: "Jalnan2TTF";
  font-size: 42px;
`;

// 이메일 패스워드
export const Form = styled.form`
  //margin-top: 50px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
`;

// 이메일 패스워드 로그인 폰트
export const Input = styled.input`
  font-family: "Jalnan2TTF";
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 350px;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  font-family: "Jalnan2TTF";
  color: black;
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`;
