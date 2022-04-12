import React, { useEffect } from 'react';
import styled from 'styled-components';
import { BackArrow, ChargingIcon } from '../icons';
import { CommandIcons } from './constants';
import { motion } from 'framer-motion';

function SendScreen(props) {
    if (props.show) {
        const srcIcon = CommandIcons.find(icon => icon.name === props.command);
        let timeout = null;

        useEffect(() => {
            if (!props.disabled) {
                restartAutoReset();

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('touchstart', onMouseMove);
            }
        });

        const onMouseMove = () => {
            restartAutoReset();
        };

        const restartAutoReset = () => {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                props.resetModal();
                props.sendCommand('i');
            }, 1000 * 60); // 60 Seconds
        };

        const increaseBattery = () => {
            
        }

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
                    <Subtitle disabled={props.disabled}>{props.name === "Home" ? "Select if you would like to Charge the Car or Charge the Home" : ""}</Subtitle>
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
                    <srcIcon.src height="20vh" />
                }
                <Description>
                    {props.description}
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
  font-size: 20px;
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
  font-size: 20px;
  padding: 10vh;
  max-width: 700px;
  text-align: center;
`;

const GoBack = styled(BackArrow)`
  height: 6vh;
  position: absolute;
  left:0;
  top:0;
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