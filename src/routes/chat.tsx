import Chatting from "../components/chatting";
import ChatTitle from "../components/chat-title";
import { styled } from "styled-components";
import ChatTimeline from "../components/chat-timeline";
import LayOut from "../components/chatlayout"

const Wrapper = styled.div`
  //채팅 틀
  background-color: #f6e3ce;
  width: 100%;
  height: 80%;
`;

const Divs = styled.div`
  position: fixed; //채팅 틀
  top: 0;
  right: 0;
  width: 75%;
  height: 100%;
`;

const Lay = styled.div`
  width: 25%;
`;
const C = styled.div`
  width: 100%;
  height: 10%;
`;


export default function Chat() {
  return (
    <>
      <Lay>
        <LayOut />
      </Lay>
      <Divs>
        <C>
          <ChatTitle />
        </C>
        <Wrapper>
          <ChatTimeline />
        </Wrapper>
        <C>
          <Chatting />
        </C>
      </Divs>
    </>
  );
}
