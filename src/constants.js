import {
  Grid,
  HomeCommand, WorkCommand, 
  SolarCommand, SuperChargeCommand,
  OutageCommand, Battery, 
  ChargeCar, ChargeHome, NanoGrid, MicroGrid, MacroGrid
} from '../icons';

export const Descriptions = {
  home: "Electric Vehicles have the potential to use bi-directional charging. This means that when an EV is parked in the garage and plugged into an outlet, it can charge its battery like normal or provide power to the house using its own battery! When the car arrives at home, choose which direction you want the energy to go.", 
  solar: "Solar station time. Charge up that car. Sunny days only. WOW!",
  work: ["Imagine your car battery charging while you're at work. With EVs, this is a real and achievable possibility! Parking garages in cities can be equipped with inductive (wireless) charging stations. This means that you can park your car in a space like you normally would, and it will charge itself throughout the day- no plugins needed. All you have to do is park and let the energy flow!","Did you know an electric vehicle can charge itself through the ground? Using a technology commonly seen in phones known as inductive charging, electric vehicles can park and charge without a physical connection. All you have to do is drive over a charger, and you can leave your car in the spot to charge while you work! This technology is available, but city infrastructures currently do not support it."],
  outage: ["A modern electrical grid is designed to be resilient in the face of natural disasters, extreme weather, and other unforgiving circumstances. In the event that the macrogrid and multiple micro/nanogrids are taken down, certain grids should still be operational and function independently! Watch as the EV drives home to provide power to the home even though the areas around it are without electricity.", "In February 2021, the state of Texas suffered a major power crisis as a snowstorm devastated its electric grid. With a modern electric grid, this is no longer a possibility. In the face of disaster, independent grids are resilient and will function even if entire cities and neighborhoods are without power. In this scenario, the EV powers the home, creating an operational nanogrid while the surrounding grids are down."],
  grid: "A Modern Electric Grid consists of multiple nanogrids, which combine to form microgrids, which combine to form the macrogrid. Every nano and microgrid can operate independently without relying on each other for energy. Different grids can also work together to transfer and store energy across entire cities and states. This model demonstrates a much needed upgrade to our society's electric grid.",
  nano: "A nanogrid consists of 1-2 homes, and an electric vehicle. The house(s) and EV can provide power to each other as needed, and they can operate entirely independently of the nanogrids near them. This means that other houses in the neighborhood could lose power, but this nanogrid would still be operational!",
  micro: "A microgrid contains multiple nanogrids. In this model, the neighborhood you see to your right is an example: multiple houses (nanogrids) combine together to form a complete microgrid. Microgrids operate independently of the macrogrid. This means that a power outage could occur in the city, but the neighborhood would still have power. Houses within the microgrid can also provide power to each other as needed, which creates a grid that rarely goes down!",
  macro: "The macrogrid is the term we use to describe an entire area powered by electricity. In this model, the macrogrid consists of a city (left), renewable energy farm (middle), and neighborhood (right). Multiple microgrids combine and lie within the macrogrid. The macrogrid allows for energy transfer across itself, which enables the potential for an energy market. Consumers can sell extra electricity that they don’t need back to the grid, and energy can be moved from cities to neighborhoods depending on need.",
  super: "Super charge that car RIGHT now. In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  battery: "Did you know this battery can recharge? Woah. In February and March 2021, sensors at the Mauna Loa observatory in Hawaii – which has tracked Earth’s atmospheric concentration of CO2 since the late 1950s – detected CO2 concentrations of more than 417 parts per million (ppm). Pre-industrial levels were 278 ppm, which means that humans are halfway to doubling the concentration of CO2 in the atmosphere compared to the period between 1750 and 1800.",
  charging: "You can choose to either charge the car or charge the home! They can both power eachother!!!!!",
  carCharge: ["The house is currently providing power to the car to charge its battery. A standard wall outlet (120V AC) will fully charge an EV in 20-40 hours. However, most EVs come with custom wall connectors that shorten the charge time to an average of 8 hours.","The house is currently providing power to the car to charge its battery. EVs can charge their batteries at home at a variety of different speeds depending on desired electricity costs, current strain on the electric grid, or upgraded equipment like custom connectors or the Tesla Powerwall."],
  homeCharge: ["The car is currently powering the house using its own battery. This is a technology that is possible, but is not yet standard in the United States. New electric vehicles can provide as much as 9.5 kilowatts into a home, which is plenty- especially during a power outage or a grid failure.","The car is currently powering the house using its own battery. The average electric vehicle has enough battery capacity to fully power a home for several days. This prevents the possibility of being without electricity in your house during an outage."]
}

export const CommandIcons = [
  { name: "grid", src: Grid, src2: NanoGrid, src3: MicroGrid, src4: MacroGrid },
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
