# Android Installation

If you would like to install this program on Android, follow these steps.

## Requirements

- Install **F-Droid**.
- Open **F-Droid** and search for **Termux**.
- Install the latest version of **Termux**.
- It is recommended to use the **Node.js LTS** version.

## Install Node.js

Open **Termux** and run the following commands:

```bash
pkg update && pkg upgrade -y
```

```bash
pkg install nodejs-lts -y
```

> If `nodejs-lts` is not available, use:

```bash
pkg install nodejs -y
```

## Verify the installation

Make sure Node.js and npm are installed correctly:

```bash
node -v
npm -v
```

## Clone the project

```bash
git clone https://github.com/eitfabrizio/sapflight-ai.git
cd sapflight-ai
```

## Install dependencies

```bash
npm install
```

## Build the project

```bash
npm run build
```

## Start the project

```bash
npm start
```

## Notes

- Keep Termux updated:

```bash
pkg update && pkg upgrade -y
```

- If a package fails to install, make sure you are using the latest version of **Termux** from **F-Droid**, not the Google Play Store.
- Using the **Node.js LTS** version is recommended for this project.
- Using **ChatGPT** for troubleshooting and setup assistance is also recommended.
- An Android version of this project is planned for a future release.
