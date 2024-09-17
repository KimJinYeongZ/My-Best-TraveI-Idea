
import { HistoryID } from "./history-timeline";
import styled from "styled-components";
import react, {useState} from "react";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column; // 수직 방향으로 요소들을 정렬
    align-items: flex-start; // 수평 방향으로 시작 부분에 정렬 (왼쪽)
    color: black;
    width: 100%;
    margin-bottom: 10px;
    margin-top: 10px;

    font-family: "Jalnan2TTF";
    position: absolute; 
    bottom: 0px;
`;

export default function History({ id, userId, title  }: HistoryID) {

    return (
        <>
            <Wrapper>
                {title}
            </Wrapper>
        </>
    );
    
}   