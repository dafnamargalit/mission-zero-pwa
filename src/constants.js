import {
  Grid,
  HomeCommand, WorkCommand, 
  SolarCommand, SuperChargeCommand,
  OutageCommand, Battery, 
  ChargeCar, ChargeHome
} from '../icons';

export const Descriptions = {
  home: "Did you know? In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.", 
  solar: "Solar station time. Charge up that car. Sunny days only. WOW!",
  work: "Time to go to work! Did you know that climate change is bad? Like NOT good. The planet is dying! In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  outage: "Oh no the power is out! Whatever will we do? Super car to the rescue. In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  grid: "Let's simulate what a modern grid looks like. Macro, micro, oh my! In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  super: "Super charge that car RIGHT now. In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  battery: "Did you know this battery can recharge? Woah. In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  charging: "You can choose to either charge the car or charge the home! They can both power eachother!!!!!",
  carCharge: "Charge the car! Did you know batteries can be rechargeable???",
  homeCharge: "Charge the home! Did you know you can power the house with a car??? Woah."
}

export const CommandIcons = [
  { name: "grid", src: Grid },
  { name: "home", src: HomeCommand, src2: ChargeCar, src3: ChargeHome },
  { name: "work", src: WorkCommand },
  { name: "solar", src: SolarCommand },
  { name: "super", src: SuperChargeCommand },
  { name: "outage", src: OutageCommand },
  { name: "battery", src: Battery },
  { name: "carCharge", src: ChargeCar},
  { name: "homeCharge", src: ChargeHome}
];

export const CarColors = ['red', 'blue', 'green', 'purple'];
