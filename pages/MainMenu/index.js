import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Logo, HomeCommand } from '../../icons';
import { motion } from 'framer-motion';

const MainMenu = () => {

    const sendCommand = async () => {
        console.log()
    }

    return (
        <MainWrap>

            Main Menu
            <Button />
            <motion.div whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }}>
                <SendHome onClick={() => { sendCommand(); }}/>
            </motion.div>
        </MainWrap>
    )
}


const commands = [
    {
        name: 'Home'
    },
    // {
    //     name: 'Work'
    // },
    // {
    //     name: 'Super'
    // },
]

const MainWrap = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const Button = styled(Logo)`
  height: 50vh;
`;

const SendHome = styled(HomeCommand)`
    height: 20vh;
`;

export default MainMenu;