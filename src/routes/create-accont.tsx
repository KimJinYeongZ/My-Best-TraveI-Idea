import { useState, useContext } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Form,
  Input,
  Switcher,
  Title,
  Error,
} from "../components/auth-components";
import axios from "axios";
import { AccessTokenContext } from "../components/TokenContext";
import styled from "styled-components";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const { setAccessToken } = useContext(AccessTokenContext);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(credentials.user, {
        displayName: name,
      });
      const user = auth.currentUser;
      console.log(user);
      //console.log(auth);
      console.log(name);
      console.log(email);
      console.log(password);
      // 사용자 데이터와 토큰을 서버로 전송
      const response = await axios.post(
        "http://44.218.133.175:8080/api/v1/members/join",
        {
          name: name,
          email: email,
          password: password,
        }
      );
      console.log(name);
      console.log(email);
      console.log(password);
      console.log(response);
      console.log(
        email + "의 토큰(회원가입): " + response.data.data.token.accessToken
      );
      setAccessToken(response.data.data.token.accessToken);
      localStorage.setItem("accessToken", response.data.data.token.accessToken); // 새로고침해도 토큰 저장
      navigate("/survey");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>회원 가입</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="이름"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="비밀번호"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? "로딩중..." : "계정 생성"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        이미 가입되어 있으신가요? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}