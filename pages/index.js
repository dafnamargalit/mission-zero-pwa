import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { Logo, Car, BLEConnect, BLEDisconnect, HomeCommand, WorkCommand, SolarCommand, OutageCommand, BackArrow } from '../icons';
import { motion } from 'framer-motion';
import ReactModal from 'react-modal';
import Battery from '../src/Battery';

const Home = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [paired_devices, setDevices] = useState([]);
  const [characteristicCache, setCharacteristic] = useState(null);
  const [receivedData, setReceived] = useState(null);
  const [receiveModal, setModal] = useState(false);
  const [deviceCache, setDevice] = useState(null);
  const [h, setHomeModal] = useState(false);
  const [s, setSolarModal] = useState(false);
  const [w, setWorkModal] = useState(false);
  const [o, setOutageModal] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [batteryModal, setBatteryModal] = useState(false);
  const [battery, setBattery] = useState({ level: 0, charging: false });

  const serviceUUID = 0xFFE0;
  const charUUID = 0xFFE1;
  const handleChange = ({ target: { level, charging } }) => {
    setBattery({ level, charging });
 }

 useEffect(() => {
   let battery;
   navigator.getBattery().then(bat => {
     battery = bat;
     battery.addEventListener("levelchange", handleChange);
     battery.addEventListener("chargingchange", handleChange);
     handleChange({ target: battery });
   });
   return () => {
     battery.removeEventListener("levelchange", handleChange);
     battery.removeEventListener("chargingchange", handleChange);
   };
 }, []);

  const pairCar = (device) => {
    if (device.gatt.connected && characteristicCache) {
      console.log("Already Connected.");
      return;
    }

    device.gatt.connect().then(
      server => {
        setDevice(device);
        setIsConnected(true);
        console.log("GATT Server connected, finding service...");
        return server.getPrimaryService(serviceUUID);
      }
    ).then(
      service => {
        console.log("Found service, finding characteristic...");
        return service.getCharacteristic(charUUID);
      }
    ).then(
      characteristic => {
        console.log("Found characteristic, starting notifications...");
        setCharacteristic(characteristic);
        return characteristic.startNotifications();
      }
    ).then(characteristic => {
      console.log(characteristic, "Notifications started.");
      characteristic.addEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
    }
    )
  }

  const resetModal = () => {
    setHomeModal(false);
    setWorkModal(false);
    setSolarModal(false);
    setOutageModal(false);
    setDisabled(true);
  }


  function handleCharacteristicValueChanged(event) {
    let value = new TextDecoder().decode(event.target.value);

    if (value == "A") {
      setDisabled(false);
    }
    setReceived(value);
    setModal(true);
    console.log(value, 'in');
  }
  function disconnect() {
    if (deviceCache) {
      console.log('Disconnecting from "' + deviceCache.name + '" bluetooth device...');

      if (deviceCache.gatt.connected) {
        deviceCache.gatt.disconnect();
        console.log('"' + deviceCache.name + '" bluetooth device disconnected');
      }
      else {
        console.log('"' + deviceCache.name +
          '" bluetooth device is already disconnected');
      }
    }

    if (characteristicCache) {
      characteristicCache.removeEventListener('characteristicvaluechanged',
        handleCharacteristicValueChanged);
      setCharacteristic(null);
    }


    setDevice(null);
    setIsConnected(false);
    setDevices([]);
  }

  const sendCommand = (data) => {
    data = String(data);
    if (data === 'h') {
      setHomeModal(true);
    }
    if (data === 's') {
      setSolarModal(true);
    }
    if (data === 'w') {
      setWorkModal(true);
    }
    if (data === 'o') {
      setOutageModal(true);
    }

    if (!data || !characteristicCache) {
      return;
    }

    data += '\n';

    if (data.length > 20) {
      let chunks = data.match(/(.|[\r\n]){1,20}/g);

      writeToCharacteristic(characteristicCache, chunks[0]);

      for (let i = 1; i < chunks.length; i++) {
        setTimeout(() => {
          writeToCharacteristic(characteristicCache, chunks[i]);
        }, i * 100);
      }
    }
    else {
      characteristicCache.writeValue(new TextEncoder().encode(data))
    }


  }

  function getDevicesOnClick() {
    if (!isConnected) {
      console.log('Getting existing permitted Bluetooth devices...');
      navigator.bluetooth.getDevices()
        .then(devices => {
          console.log('> Got ' + devices.length + ' Bluetooth devices.');
          for (const device of devices) {
            console.log('  > ' + device.name + ' (' + device.id + ')');
          }
          setDevices(devices);
        })
        .catch(error => {
          console.log('Argh! ' + error);
        });

    }
  }

  function requestDeviceOnClick() {
    console.log('Requesting any Bluetooth device...');
    navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceUUID] }]
    })
      .then(device => {
        console.log('> Requested ' + device.name + ' (' + device.id + ')');
      }).catch(error => {
        console.log('Argh! ' + error);
      });
  }

  const closeModal = () => {
    setModal(false);
  };


  return (
    <HomeWrap>
      <Head>
        <title>EVEE</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="theme-color" content="#000" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </Head>
      <HomeHeader>
        <motion.div whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }}>
          {!isConnected ? <BLEConnectIcon onClick={() => { requestDeviceOnClick(); }} />
            : <BLEDisconnectIcon onClick={() => { disconnect(); }} />}
        </motion.div>
      </HomeHeader>

      <Button onClick={() => { getDevicesOnClick(); }} />

      {!isConnected && paired_devices.map((car, i) => {
        return (
          <div key={i}>
            <CarSelect x={i} carColor={colors[i]} onClick={() => { pairCar(car); }} />
            {console.log(car.name)}
          </div>
        )
      })}

      {isConnected && !(h || s || o || w) &&
        <>
          <SendHome onClick={() => { sendCommand('h'); }} />
          <SendWork onClick={() => { sendCommand('w'); }} />
          <SendSolar onClick={() => { sendCommand('s'); }} />
          <SendOutage onClick={() => { sendCommand('o'); }} />
        </>
      }


      <BatteryFooter>
        <Battery {...battery} />
      </BatteryFooter>
      <ReactModal
        isOpen={receiveModal}
        onRequestClose={closeModal}
        ariaHideApp={false}
        contentLabel="Selected Option"
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.3)'
          },
          content: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: 'none',
            borderRadius: '1em',
            height: '60vh',
            width: '80vh',
            left: '50%',
            top: '50%',
            right: '0',
            bottom: '0',
            transform: 'translate(-50%, -50%)'
          }
        }
        }
      >
        Received Data: {receivedData}
      </ReactModal>

      {
        h &&
        <SendModal>
          <GoBack disabled={disabled} onClick={() => { resetModal() }} />
          <Header>
            <Title>{disabled ? "Arrived" : "Going"} Home<Dots show={disabled} /></Title>
          </Header>
          <HomeCommand height="30vh" />
        </SendModal>
      }
      {
        s &&
        <SendModal>
          <GoBack disabled={disabled} onClick={() => { resetModal() }} />
          <Header>
            <Title>{disabled ? "Arrived" : "Going"} to Solar Charging Station<Dots show={disabled} /></Title>
          </Header>
          <SolarCommand height="30vh" />
        </SendModal>
      }
      {
        w &&
        <SendModal>
          <GoBack disabled={disabled} onClick={() => { resetModal() }} />
          <Header>
            <Title>{disabled ? "Arrived" : "Going"} to Work<Dots show={disabled} /></Title>
          </Header>
          <WorkCommand height="30vh" />
        </SendModal>
      }
      {
        o &&
        <SendModal>
          <GoBack disabled={disabled} onClick={() => { resetModal() }} />
          <Header>
            <Title>{disabled ? "Completed" : "Initiating"} Power Outage Sceenario<Dots show={disabled} /></Title>
          </Header>
          <OutageCommand height="30vh" />
        </SendModal>
      }
      {
        batteryModal &&
        <SendModal>
          <GoBack disabled={true} onClick={() => { resetModal() }} />
        </SendModal>
      }
    </HomeWrap>
  )
}

const HomeWrap = styled.div`
  height: 100vh;
  display: flex;
  margin: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

const HomeHeader = styled.div`
  position: absolute;
  left: 0;
  top: 2vh;
`
const BatteryFooter = styled.div`
  position: absolute;
  left: 0;
  top: 10vh;
`

const Button = styled(Logo)`
  position: absolute;
  height: 30vh;
  width: 30vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  transition: transform .2s;
  &:hover, &:active{
    transform: scale(1.05);
  }
`;


const CarSelect = styled(Car)`
position: absolute;
height: 10vh;
width: 10vh;
border-radius: 50%;
margin-left: auto;
margin-right: auto;
left: 0;
right: 0;
transition: transform .2s;
transform: translateY(${({ x }) => x == 0 ? "-25vh" : (x == 2 ? "25vh" : 0)}) translateX(${({ x }) => x == 1 ? "-25vh" : (x == 3 ? "25vh" : 0)});
&:hover, &:active{
  transform: scale(1.05) translateY(${({ x }) => x == 0 ? "-25vh" : (x == 2 ? "25vh" : 0)}) translateX(${({ x }) => x == 1 ? "-25vh" : (x == 3 ? "25vh" : 0)});
}
  path {fill: ${({ carColor }) => carColor ? carColor : 'white'};}
`;

const BLEConnectIcon = styled(BLEConnect)`
  width: 60px;
`;

const BLEDisconnectIcon = styled(BLEDisconnect)`
  width: 40px;
  padding: 10px;
`;

const SendHome = styled(HomeCommand)`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  width: 10vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: transform .2s;
  transform: translateY(-25vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-25vh);
  }
`;

const SendWork = styled(WorkCommand)`
  position: absolute;
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: transform .2s;
  transform: translateY(25vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(25vh);
  }
`;

const SendSolar = styled(SolarCommand)`
  position: absolute;
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: transform .2s;
  transform: translateX(25vh);
  &:hover, &:active{
    transform: scale(1.05) translateX(25vh);
  }
`;

const SendOutage = styled(OutageCommand)`
  position: absolute;
  height: 10vh;
  width: 10vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: transform .2s;
  transform: translateX(-25vh);
  &:hover, &:active{
    transform: scale(1.05) translateX(-25vh);
  }
`;

const SendModal = styled.div` 
  position: absolute;
  height: 100vh;
  width: 100%;
  background-color: black;
  display: flex;
  align-items: center;

  flex-direction: column;
`;

const GoBack = styled(BackArrow)`
  height: 6vh;
  position: absolute;
  left:0;
  top:0;
  padding: 2em;
  transition: transform .2s;
  pointer-events: ${({ disabled }) => disabled ? "auto" : "none"};
  path {
    fill: ${({ disabled }) => disabled ? "white" : "grey"};;
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

const Title = styled.div` 
  color: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 20px;
`;

const Header = styled.div` 
  display: flex;
  align-items: center;
  height: 40vh;
`;
const colors = ['red', 'blue', 'green', 'purple'];



export default Home;