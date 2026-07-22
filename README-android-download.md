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

and

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
- If a package fails to install, ensure you're using the latest version of Termux from **F-Droid**, not the Google Play Store.
- I recomed use the lts version for this proyect, and the asinstence of chatgpt.
- I will going to do a version to android.
