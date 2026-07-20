# Android Installation

If you would like to install this program on Android, follow these steps.

## Requirements

- Install **F-Droid**.
- Open **F-Droid** and search for **Termux**.
- Install the latest version of **Termux**.

## Install Node.js

Open **Termux** and run the following commands:

```bash
pkg update && pkg upgrade -y
```

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
git clone <https://github.com/eitfabrizio/sapflight-ai/edit/Aplication/README-android-download.md>
cd <sapflight-ai>
```

## Install dependencies

```bash
npm install
```

## Start the project

If your project uses:

```bash
npm start
```

or

```bash
npm run dev
```

or

```bash
npm run build
```

(depending on your project).

## Notes

- Keep Termux updated:
  ```bash
  pkg update && pkg upgrade -y
  ```
- If a package fails to install, ensure you're using the latest version of Termux from **F-Droid**, not the Google Play Store.
