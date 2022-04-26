This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn next dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## File Structure

  ```pages/index.js```
  
  - The main page where all components are loaded. Contains Web Bluetooth functions and initialization as well as the overall structure of the web app.
  
  ```src/SendScreen.js```
  
  - A general component for the screen that pops up based on the icon clicked (all specifics are passed in through props)

  ```src/constants.js```
  - Descriptions, icons, car colors all defined in this file. 
