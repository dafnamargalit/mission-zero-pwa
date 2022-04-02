import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Logo, Car, Battery, Grid, BLEConnect, BLEDisconnect,
  HomeCommand, WorkCommand, SolarCommand, SuperChargeCommand,
  OutageCommand
} from '../icons';
import { Descriptions, CarColors } from '../src/constants';
import { motion } from 'framer-motion';
import ReactModal from 'react-modal';
import SendScreen from '../src/SendScreen';

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      paired_devices: [],
      characteristicCache: null,
      receivedData: null,
      receiveModal: false,
      deviceCache: null,
      h: false,
      s: false,
      w: false,
      o: false,
      g: false,
      c: false,
      q: false,
      disabled: false,
      batteryModal: false,
      battery: { actual: null, simulated: 100, connected: false, color: "#00ff00" },
      lowBattery: false,
      lowBatteryScreen: false,
      chargePrompt: false,
      serviceUUID: 0xFFE0,
      charUUID: 0xFFE1,
      inactive: false
    }
  }

  pairCar = (device) => {
    if (device.gatt.connected && this.state.characteristicCache) {
      console.log("Already Connected.");
      return;
    }

    device.gatt.connect().then(
      server => {
        device.addEventListener('gattserverdisconnected', this.onDisconnected);
        this.setState({ deviceCache: device, isConnected: true });
        console.log("GATT Server connected, finding service...");
        return server.getPrimaryService(this.state.serviceUUID);
      }
    ).then(
      service => {
        console.log("Found service, finding characteristic...");
        return service.getCharacteristic(this.state.charUUID);
      }
    ).then(
      characteristic => {
        console.log("Found characteristic, starting notifications...");
        this.setState({ characteristicCache: characteristic });
        return characteristic.startNotifications();
      }
    ).then(characteristic => {
      console.log(characteristic, "Notifications started.");
      characteristic.addEventListener('characteristicvaluechanged',
        this.handleCharacteristicValueChanged);
      let battery = { ...this.state.battery };
      battery.connected = true;
      this.setState({ battery: battery });
    }
    ).catch(error => {console.log(error)});
  }

  resetModal = () => {
    this.setState({
      h: false,
      w: false,
      s: false,
      o: false,
      g: false,
      c: false,
      q: false,
      disabled: false,
    });
  }

  closeBatteryModal = () => {
    this.setState({
      batteryModal: false,
      lowBatteryScreen: false
    })
  }

  onDisconnected = (event) => {
    // Object event.target is Bluetooth Device getting disconnected.
    this.setState({
      receivedData: "Bluetooth device disconnected. Please ensure you are within range and check connection.",
      receiveModal: true,
      isConnected: false,
      deviceCache: null,
      characteristicCache: null,
      battery: { actual: null, simulated: 100, charging: false, connected: false, color: "#00ff00" },
      devices: [],
    })
    console.log('> Bluetooth Device disconnected');
  }

  handleCharacteristicValueChanged = (event) => {
    let value = new TextDecoder().decode(event.target.value);
    let battery = { ...this.state.battery };
    console.log(value);
    if (value[0] == "a") { //arrived
      this.setState({ disabled: false })
    }
    else if (value[0] == "e") { //error
      this.setState({
        receiveModal: true,
        receivedData: "Error: " + value.substring(1),
      })
    }
    else if (value[0] == "b") { //battery level
      let batteryVal = parseInt(value.substring(1));
      if (battery.actual == null) {
        battery.actual = batteryVal / 100;
        this.setState({ battery: battery });
        console.log(battery.actual)
      }
      else {
        let diff = battery.actual - batteryVal / 100;
        console.log(battery.actual, battery.simulated, diff);
        battery.actual = batteryVal / 100;
        battery.simulated = batteryVal / 100;
        if (diff > 0) {
          battery.simulated = (batteryVal / 100) - diff * 10;
        }
      }
      if (battery.simulated <= 50 && battery.simulated > 25) { //mid battery, turn yellow
        battery.color = "#FFC633";
      }
      else if (battery.simulated > 50) { // high battery, turn green
        battery.color = "#00ff00";
      }
      else if (battery.simulated <= 25) { //low battery, turn red
        battery.color = "#ff0000";
        this.setState({
          lowBattery: true
        })
      }
      this.setState({
        battery: battery
      })
    }
    else if (value[0] == "c") { //charging
      battery.charging = true;
      this.setState({
        battery: battery,
        lowBattery: false
      })
    }
    else if (value == "sc") { //stopped charging
      battery.charging = false;
      this.setState({
        battery: battery
      })
    }
    else {
      this.setState({
        receivedData: value,
        receiveModal: true,
      })
      console.log(value, 'in');
    }
  }
  
  disconnect = () => {
    const {deviceCache, characteristicCache} = this.state;
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
        this.handleCharacteristicValueChanged);
      this.setState({
        characteristicCache: null,
      })
    }

    this.setState({
      isConnected: false,
      deviceCache: null,
      battery: { actual: null, simulated: 100, charging: false, connected: false, color: "#00ff00" },
      devices: [],
    });
  }

  sendCommand = (data) => {
    const {deviceCache, characteristicCache} = this.state;

    if (deviceCache && !deviceCache.gatt.connected) {
      this.setState({
        receiveModal: true,
        receivedData: "Bluetooth device is not connected. Please ensure you are within range and check connection.",
        isConnected: false,
      });
    }
    else {
      data = String(data);
      if (data === 'h') {
        this.setState({
          h: true,
        });
      }
      if (data === 's') {
        this.setState({
          s: true,
        });
      }
      if (data === 'w') {
        this.setState({
          w: true,
        });
      }
      if (data === 'o') {
        this.setState({
          o: true,
        });
      }
      if (data === 'g') {
        this.setState({
          g: true,
        });
      }
      if (data === 'c') {
        this.setState({
          c: true,
        });
      }
      if (data === 'q') {
        this.setState({
          batteryModal: true,
          h: false
        });
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
  }

  getDevicesOnClick = () => {
    if (!this.state.isConnected) {
      console.log('Getting existing permitted Bluetooth devices...');
      navigator.bluetooth.getDevices()
        .then(devices => {
          console.log('> Got ' + devices.length + ' Bluetooth devices.');
          if (devices.length == 0) {
            this.setState({
              receiveModal: true,
              receivedData: "No Bluetooth devices found. Please ensure you are within range and check connection.",
            });
          }
          for (const device of devices) {
            console.log('  > ' + device.name + ' (' + device.id + ')');
          }
          this.setState({
            paired_devices: devices,
          })
        })
        .catch(error => {
          console.log('Argh! ' + error);
        });

    }
  }

  requestDeviceOnClick = () => {
    console.log('Requesting any Bluetooth device...');
    navigator.bluetooth.requestDevice({
      filters: [{ services: [this.state.serviceUUID] }]
    })
      .then(device => {
        console.log('> Requested ' + device.name + ' (' + device.id + ')');
      }).catch(error => {
        console.log('Argh! ' + error);
      });
  }

  closeModal = () => {
    this.setState({
      receiveModal: false,
    })
  };

  render() {
    const { isConnected, paired_devices, battery,
      lowBattery, receiveModal, receivedData,
      disabled, h, w, o, s, g, c, batteryModal, q, lowBatteryScreen } = this.state;
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
            {!isConnected ? <BLEConnectIcon onClick={() => { this.requestDeviceOnClick(); }} />
              : <BLEDisconnectIcon onClick={() => { this.disconnect(); }} />}
          </motion.div>
        </HomeHeader>

        <Button onClick={() => { this.getDevicesOnClick(); }} />

        {!isConnected && paired_devices.map((car, i) => {
          return (
            <div key={i}>
              <CarSelect x={i} carColor={CarColors[i]} onClick={() => { this.pairCar(car); }} />
            </div>
          )
        })}

        {isConnected &&
          <>
            <SendHome onClick={() => { this.sendCommand('h'); }} />
            <SendWork onClick={() => { this.sendCommand('w'); }} />
            <SendSolar onClick={() => { this.sendCommand('s'); }} />
            <SendOutage onClick={() => { this.sendCommand('o'); }} />
            <SendGrid onClick={() => { this.sendCommand('g'); }} />
            <SendSuperCharge onClick={() => { this.sendCommand('c'); }} />
          </>
        }

        {battery.connected && <BatteryFooter onClick={() => { this.setState({ batteryModal: true }) }}>
          <Battery level={battery.simulated} color={battery.color} height="10vh" />
        </BatteryFooter>}

        <ReactModal
          isOpen={receiveModal}
          onRequestClose={this.closeModal}
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
              color: 'black',
              border: 'none',
              borderRadius: '1em',
              height: '60vh',
              width: '80vh',
              left: '50%',
              top: '50%',
              right: '0',
              bottom: '0',
              transform: 'translate(-50%, -50%)',
              fontFamily: "Helvetica, Arial, sans-serif"
            }
          }
          }
        >
          {receivedData}
        </ReactModal>

        <SendScreen show={h} command="home" disabled={disabled}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Home"
          description={Descriptions.home} await="Going" done="Arrived" />
        <SendScreen show={s} command="solar" disabled={disabled}
          resetModal={() => { this.resetModal() }} name="Solar Charging Station"
          description={Descriptions.solar} await="Going to" done="Arrived at" />
        <SendScreen show={w} command="work" disabled={disabled}
          resetModal={() => { this.resetModal() }} name="Work"
          description={Descriptions.work} await="Going to" done="Arrived at" />
        <SendScreen show={o} command="outage" disabled={disabled}
          resetModal={() => { this.resetModal() }} name="Power Outage Scenario"
          description={Descriptions.outage} await="Initiating" done="Completed" />
        <SendScreen show={g} command="grid" disabled={disabled}
          resetModal={() => { this.resetModal() }} name="Grid Simulation"
          description={Descriptions.grid} await="Initiating" done="Completed" />
        <SendScreen show={c} command="super" disabled={disabled}
          resetModal={() => { this.resetModal() }} name="Super Charging Station"
          description={Descriptions.super} await="Going to" done="Arrived at" />
        <SendScreen show={batteryModal || lowBatteryScreen} command="battery" disabled={false}
          resetModal={() => { this.closeBatteryModal() }} lowBattery={lowBattery}
          name="Car Battery" charging={battery.charging} color={battery.color} level={battery.simulated} await="Charging" done="Charged"
          description={Descriptions.battery} />
      </HomeWrap>
    )
  }
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
  z-index: 1000;
  right: 2vh;
  top: 1vh;
  &:hover, &:active{
    transform: scale(1.05);
  }
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

const SendGrid = styled(Grid)`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  width: 10vh;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  transition: transform .2s;
  transform: translateY(-10vh) translateX(22vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-10vh) translateX(22vh);
  }
`

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
  transform: translateY(15vh) translateX(-22vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(15vh) translateX(-22vh);
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
  transform: translateY(15vh) translateX(22vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(15vh) translateX(22vh);
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
  transform: translateY(-10vh) translateX(-22vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-10vh) translateX(-22vh);
  }
`;

const SendSuperCharge = styled(SuperChargeCommand)`
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
const SendModal = styled.div` 
  position: absolute;
  height: 100vh;
  width: 100%;
  background-color: black;
  display: flex;
  align-items: center;

  flex-direction: column;
`;

const Title = styled.div` 
  color: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 20px;
`;

const Header = styled.div` 
  display: flex;
  align-items: center;
  height: 30vh;
`;


