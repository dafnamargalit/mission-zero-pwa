
import React from 'react';
import { HomeCommand } from '../icons';
import styled from 'styled-components';

const SendModal = () => {

    return(
        <SendModalWrap>
            <HomeCommand height="30vh"/>
        </SendModalWrap>
    )
}

const SendModalWrap = styled.div` 
position: absolute;
height: 100vh;
width: 100%;
background-color: black;
display: flex;
align-items: center;
justify-content: center;
`;

export default SendModal;