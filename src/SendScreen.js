import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BackArrow, ChargingIcon } from '../icons';
import { CommandIcons } from './constants';
import { motion } from 'framer-motion';
import { Descriptions } from './constants';
function SendScreen(props) {
    if (props.show) {
        const srcIcon = CommandIcons.find(icon => icon.name === props.command);
        let timeout = null;
        const [sent, setSent] = useState(false);
        const [sending, setSending] = useState(false);
        const [description, setDescription] = useState(props.description)
        useEffect(() => {
            if (!props.disabled) {
                restartAutoReset();
                if ((props.command === "solar") && sent === false) {
                    setTimeout(() => { props.sendCommand('q') }, 1000);
                    setSent(true);
                }
                if ((props.command === "grid") && sent === false && sending === false){
                    setSending(true);
                    console.log("sending")
                    setTimeout(() => { props.sendCommand('NG');}, 2000);
                    setTimeout(() => { props.sendCommand('IG'); }, 2000);
                    setTimeout(() => { props.sendCommand('AG'); console.log("sending false")
                    setSending(false);}, 2000);
                }
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('touchstart', onMouseMove);
            }
        });

        const onMouseMove = () => {
            restartAutoReset();
        };

        const rotateGrid = (sel) => {
            props.sendCommand(sel);
        }
        const gridSelect = (sel) => {
            props.sendCommand(sel);
            setDescription(Descriptions[sel]);
            setSent(true);
        };
        const restartAutoReset = () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                props.resetModal();
                props.sendCommand('t');
            }, 1000 * 60); // 60 Seconds
        };


        return (
            <SendWrapper>
                <GoBack disabled={props.disabled} onClick={() => { props.resetModal() }} />
                <Header>
                    {props.command === "battery" ?
                        <Title>
                            {props.lowBattery ? "ALERT! Car Has Low Battery" : props.charging ? "Charging Battery" : props.name}{props.charging ? <Dots show={true} /> : ""}
                        </Title>
                        :
                        <Title>{props.disabled ? props.await : props.done} {props.name}<Dots show={props.disabled} /></Title>}

                    <Subtitle disabled={props.disabled}>{props.name === "Home" ? "Select if you would like to Charge the Car or Charge the Home" : props.command === "grid" ? "Select a grid to simulate." : ""}</Subtitle>
                </Header>
                {props.command === "home" &&
                    <Options disabled={props.disabled}>
                        <motion.div whileHover={{
                            scale: 1.2,
                            transition: { duration: .2 },
                        }}
                            whileTap={{ scale: 0.9 }}>
                            <srcIcon.src2 height="15vh" onClick={() => { props.sendCommand('qc') }} />
                            <Subtitle>Charge Car</Subtitle>
                        </motion.div>
                        <motion.div whileHover={{
                            scale: 1.2,
                            transition: { duration: .2 },
                        }}
                            whileTap={{ scale: 0.9 }} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                            <srcIcon.src3 height="15vh" onClick={() => { props.sendCommand('qh') }} />
                            <Subtitle>Charge Home</Subtitle>
                        </motion.div>
                    </Options>}
                {props.command === "battery" ?
                    <>
                        <BatteryWrap>
                            <srcIcon.src height="20vh" color={props.color} level={props.level} />
                            {props.charging ? <ShowCharging /> : ""}
                        </BatteryWrap>
                        <Title>
                            Battery Percentage: {Math.round(props.level * 10) / 10}%
                        </Title>
                    </>
                    :
                    props.command === "grid" ? <></> : <srcIcon.src height="20vh" />
                }
                {
                    props.command === "grid" &&
                    <Options>
                        <motion.div whileHover={{
                            scale: 1.2,
                            transition: { duration: .2 },
                        }}
                            whileTap={{ scale: 0.9 }}>
                            <srcIcon.src2 height="15vh" onClick={() => { props.disabled ? "" : gridSelect('ng') }} />
                            <Subtitle>Nanogrid</Subtitle>
                        </motion.div>
                        <motion.div whileHover={{
                            scale: 1.2,
                            transition: { duration: .2 },
                        }}
                            whileTap={{ scale: 0.9 }}>
                            <srcIcon.src3 height="15vh" onClick={() => { props.disabled ? "" : gridSelect('ig') }} />
                            <Subtitle>Microgrid</Subtitle>
                        </motion.div>
                        <motion.div whileHover={{
                            scale: 1.2,
                            transition: { duration: .2 },
                        }}
                            whileTap={{ scale: 0.9 }} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}>
                            <srcIcon.src4 height="15vh" onClick={() => { props.disabled ? "" : gridSelect('ag') }} />
                            <Subtitle>Macrogrid</Subtitle>
                        </motion.div>
                    </Options>
                }
                <Description>
                    {description}
                </Description>
            </SendWrapper>
        )
    }
    else {
        return null;
    }
}

const SendWrapper = styled.div`
    position: absolute;
    height: 100vh;
    width: 100%;
    z-index: 2;
    background-color: black;
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Title = styled.div` 
  color: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 25px;
  margin: 2vh;
`;

const Subtitle = styled.div`
    color: white;
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 20px;
    margin: 2vh;
    font-style: italic;
    display: ${({ disabled }) => disabled ? "none" : "flex"};
`;

const ShowCharging = styled(ChargingIcon)`
    position: absolute;
    height: 6vh;
    left: 5.5vh;
`;

const BatteryWrap = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;
const Header = styled.div` 
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
  flex-direction: column;
`;

const Options = styled.div`
    display: ${({ disabled }) => disabled ? "none" : "flex"};
    justify-content: space-evenly;
    width: 100%;
`

const Description = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 25px;
  padding: 10vh;
  max-width: 700px;
  text-align: center;
  font-style: italic;
`;

const GoBack = styled(BackArrow)`
  height: 6vh;
  position: absolute;
  left:4vh;
  top:6vh;
  padding: 2em;
  transition: transform .2s;
  pointer-events: ${({ disabled }) => disabled ? "none" : "auto"};
  path {
    fill: ${({ disabled }) => disabled ? "grey" : "white"};
  }
  &:hover, &:active{
    transform: scale(1.05);
  }
`;

const Dots = styled.span`
  &::after {
    display: ${({ show }) => !show ? "none" : "inline-block"};
    animation: ellipsis 1.25s infinite;
    content: ".";
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: ".";
    }
    33% {
      content: "..";
    }
    66% {
      content: "...";
    }
  }
`

export default SendScreen;