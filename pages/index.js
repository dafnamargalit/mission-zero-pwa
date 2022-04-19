import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import {
  Logo, Car, Battery, Grid,
  BLEConnect, BLEDisconnect,
  HomeCommand, WorkCommand,
  SolarCommand, SuperChargeCommand,
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
      dl: false,
      q: false,
      ig: false,
      ag: false,
      ng: false,
      descriptionText: '',
      disabled: true,
      batteryModal: false,
      battery: { actual: null, simulated: 100, charging: false, connected: false, color: "#00ff00" },
      lowBattery: false,
      lowBatteryScreen: false,
      chargePrompt: false,
      serviceUUID: 0xFFE0,
      charUUID: 0xFFE1,
      inactive: false
    }
  }

  /*
    Once bluetooth devices are found, pair with the selected device.
  */
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
    ).catch(error => { console.log(error) });
  }

  resetModal = () => {
    this.setState({
      h: false,
      w: false,
      s: false,
      o: false,
      g: false,
      dl: false,
      q: false,
      ig: false,
      ng: false,
      ag: false,
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
    console.log("Received: ", value);

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
      }
      else {
        let diff = battery.actual - batteryVal / 100;
        battery.actual = batteryVal / 100;
        battery.simulated = batteryVal / 100;
        if (diff > 0 && (diff * 10 > batteryVal / 100)) {
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
    else if (value == "d") { //stopped charging
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
    const { deviceCache, characteristicCache } = this.state;
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

  randomSelect = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  sendCommand = (data) => {
    const { deviceCache, characteristicCache } = this.state;

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
        let battery = this.state.battery;
        battery.charging = false;
        this.setState({
          h: true,
          disabled: true,
          battery: battery,
          descriptionText: Descriptions.home
        });
      }
      if (data === 's') {
        let battery = this.state.battery;
        battery.charging = true;
        this.setState({
          s: true,
          disabled: true,
          battery: battery,
          descriptionText: Descriptions.solar
        });
      }
      if (data === 'w') {
        let battery = this.state.battery;
        battery.charging = false;
        this.setState({
          w: true,
          disabled: true,
          battery: battery,
          descriptionText: this.randomSelect(Descriptions.work)
        });
      }
      if (data === 'o') {
        let battery = this.state.battery;
        battery.charging = false;
        this.setState({
          o: true,
          disabled: true,
          battery: battery,
          descriptionText: Descriptions.outage
        });
      }
      if (data === 'g') {
        let battery = this.state.battery;
        battery.charging = false;
        this.setState({
          g: true,
          disabled: false,
          battery: battery,
          descriptionText: Descriptions.grid
        });
      }
      if (data === 'dl') {
        let battery = this.state.battery;
        battery.charging = false;
        this.setState({
          dl: true,
          disabled: true,
          descriptionText: Descriptions.idle,
        });
      }
      if (data === 'qc') {
        let battery = this.state.battery;
        battery.charging = true;
        this.setState({
          batteryModal: true,
          disabled: false,
          battery: battery,
          descriptionText: this.randomSelect(Descriptions.carCharge),
          h: false,
        })
      }
      if (data === 'qh') {
        let battery = this.state.battery;
        battery.charging = true;
        this.setState({
          batteryModal: true,
          disabled: false,
          battery: battery,
          descriptionText: this.randomSelect(Descriptions.homeCharge),
          h: false,
        })
      }
      if (data === 'q') {
        let battery = this.state.battery;
        battery.charging = true;
        this.setState({
          batteryModal: true,
          disabled: false,
          battery: battery,
          descriptionText: Descriptions.battery,
          s: false,
          c: false
        })
        return;
      }
      if (data === 'ng') {
        this.setState({
          disabled: true,
          descriptionText: Descriptions.nano
        })
      }
      if (data === 'ig') {
        this.setState({
          disabled: true,
          descriptionText: Descriptions.micro
        })
      }
      if (data === 'ag') {
        this.setState({
          disabled: true,
          descriptionText: Descriptions.macro
        })
      }
      if (!data || !characteristicCache) {
        return;
      }

      data = '#' + data + '!';
      data += '\n';


      characteristicCache.writeValue(new TextEncoder().encode(data)).catch(error => { console.log(error) })
      console.log('sent', data);

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
              receivedData: "No Bluetooth devices found. Please select the bluetooth icon in the top left and pair with a device.",
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
      disabled, h, w, o, s, g, dl, batteryModal, idle,
      lowBatteryScreen, descriptionText } = this.state;
    return (
      <HomeWrap>
        <Head>
          <title>EVEE</title>
          <meta name="description" />
          <meta name="theme-color" content="#000" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icon-192x192.png" />
          <link rel="apple-touch-icon" href="/icon-192x192.png" />
        </Head>
        <BluetoothWrapper>
          <motion.div whileTap={{ scale: 1.2 }} whileHover={{ scale: 1.1 }}>
            {!isConnected ? <BLEConnectIcon onClick={() => { this.requestDeviceOnClick(); }} />
              : <BLEDisconnectIcon onClick={() => { this.disconnect(); }} />}
          </motion.div>
        </BluetoothWrapper>
        <HomeHeader>
          <TitleWrap>
            <Title>
              EVEE: Electric Vehicle Ecosystem Exhibit
            </Title>
            <Subtitle>
              {isConnected ? "Select an Icon To Interact" : "Click the middle icon and select a car"}
            </Subtitle>
          </TitleWrap>

        </HomeHeader>
        <Button onClick={() => { this.getDevicesOnClick(); }} />

        {!isConnected && paired_devices.map((car, i) => {
          return (
            <>
              <CarSelect key={i} x={i} carColor={CarColors[i]} onClick={() => { this.pairCar(car); }} />
            </>
          )
        })}

        {isConnected &&
          <>
            <SendHome onClick={() => { this.sendCommand('h'); }} >
              <HomeCommand />
              <Title>Home</Title>
            </SendHome>

            <SendWork onClick={() => { this.sendCommand('w'); }}>
              <WorkCommand />
              <Title>Work</Title>
            </SendWork>
            <SendSolar onClick={() => { this.sendCommand('s'); }}>
              <SolarCommand />
              <Title style={{ width: "20vh" }}> Solar Station</Title>
            </SendSolar>
            <SendOutage onClick={() => { this.sendCommand('o'); }}>
              <OutageCommand />
              <Title style={{ width: "20vh" }}>Power Outage Scenario</Title>
            </SendOutage>
            <SendGrid onClick={() => { this.sendCommand('g'); }}>
              <Grid />
              <Title style={{ width: "20vh" }}>Explore The Grid</Title>
            </SendGrid>
            <SendIdle onClick={() => { this.sendCommand('dl'); }}>
              <IdleCommand carColor={'white'} />
              <Title style={{ width: "30vh" }}>Drive Around</Title>
            </SendIdle>
          </>
        }

        {battery.connected && !batteryModal && <BatteryFooter onClick={() => { this.setState({ batteryModal: true, descriptionText: Descriptions.battery }) }}>
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
        <SendScreen show={idle} command="idle" resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Idle Driving"
          description={descriptionText} />
        <SendScreen show={h} command="home" disabled={disabled}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Home"
          description={descriptionText} await="Going" done="Arrived" />
        <SendScreen show={s} command="solar" disabled={disabled}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Solar Charging Station"
          description={descriptionText} await="Going to" done="Arrived at" />
        <SendScreen show={w} command="work" disabled={disabled}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Work"
          description={descriptionText} await="Going to" done="Arrived at" />
        <SendScreen show={o} command="outage" disabled={disabled}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Power Outage Scenario"
          description={descriptionText} await="Initiating" done="Completed" />
        <SendScreen show={g} disabled={disabled} command="grid"
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name=" The Grid"
          description={descriptionText} await="Exploring" done="Explore" />
        <SendScreen show={dl} command="idle" disabled={false}
          resetModal={() => { this.resetModal() }} sendCommand={this.sendCommand} name="Driving Around"
          description={descriptionText} await="" done="" />
        <SendScreen show={batteryModal || lowBatteryScreen} sendCommand={this.sendCommand} command="battery" disabled={false}
          resetModal={() => { this.closeBatteryModal() }} lowBattery={lowBattery}
          name="Car Battery" charging={battery.charging} color={battery.color} level={battery.simulated} await="Charging" done="Charged"
          description={descriptionText} />
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

const BluetoothWrapper = styled.div`
  position: absolute;
  left: 5vh;
  top: 7vh;
  z-index: 1;
`;

const HomeHeader = styled.div`
  position: absolute;
  top: 6vh;
  display: flex;
  width: 100vw;
  align-items: center;
  justify-content: center;
`

const BatteryFooter = styled.div`
  position: absolute;
  z-index: 1000;
  right: 5vh;
  top: 7vh;
  &:hover, &:active{
    transform: scale(1.05);
  }
`

const Title = styled.div` 
  color: white;
  font-family: 'Helvetica', 'Arial', sans-serif;
  font-size: 20px;
  margin-top: 2vh;
  text-align: center;
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

`;

const Header = styled.div` 
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
  background-color: blue;
  flex-direction: column;
`;

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

const IdleCommand = styled(Car)`
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

const SendHome = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(-27vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-27vh);
  }
`;

const SendGrid = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(-10vh) translateX(24vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-10vh) translateX(24vh);
  }
`

const SendWork = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(15vh) translateX(-24vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(15vh) translateX(-24vh);
  }
`;

const SendSolar = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(15vh) translateX(24vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(15vh) translateX(24vh);
  }
`;

const SendOutage = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(-10vh) translateX(-24vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(-10vh) translateX(-24vh);
  }
`;

const Subtitle = styled.div`
    color: white;
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 20px;
    font-style: italic;
    margin-top: 1vh;
`;

const SendIdle = styled.div`
  position: absolute;
  height: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "30vh"};
  width: ${({ customHeight }) => customHeight ? `${customHeight}vh` : "10vh"};
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: transform .2s;
  transform: translateY(27vh);
  &:hover, &:active{
    transform: scale(1.05) translateY(27vh);
  }
`;