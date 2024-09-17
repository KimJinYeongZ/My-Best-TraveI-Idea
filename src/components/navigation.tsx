import {Outlet, Link, useNavigate} from "react-router-dom";
import styled from "styled-components";
import {auth} from "../firebase";
import react, {useState} from 'react';

const MenuContainer = styled.div `
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
gap: 130px;
padding: 20px;
width: 80%;
position: fixed; // 상단에 고정
top: 0; // 상단에서 0의 위치에
right: 0; // 오른쪽에서 0의 위치에
margin-left: auto; // 왼쪽 마진을 자동으로 설정하여 오른쪽 정렬
z-index: 1000; // 다른 요소들 위에 오도록 z-index 설정
height:20%;
  `;

// 각 메뉴 아이템을 위한 스타일
const MenuItem = styled.div `
    font-family: "Gluten", cursive;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    width: 50px;
    text-align: center; 
    font-size:2em;
`
const StyledLink = styled(Link)`
  text-decoration: none; // 밑줄 제거
  color: black; // 텍스트 색상 변경
`;


export default function Navigation() {
    const navigate = useNavigate();
    return (
        <> 
        < MenuContainer > 
            <StyledLink to="/chatrooms">
                <MenuItem>
                    My
                </MenuItem>
            </StyledLink>
            <StyledLink to="/history">
                <MenuItem>
                    Best
                </MenuItem>
            </StyledLink>
            <StyledLink to="/">
                <MenuItem>
                    Trip
                </MenuItem>
            </StyledLink>
            <StyledLink to="/">
                <MenuItem>
                    Ideas
                </MenuItem>
            </StyledLink>
        </MenuContainer>
        <Outlet/>
        </>
    );
}
