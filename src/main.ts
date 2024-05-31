import { app, BrowserWindow, shell } from "electron";
import * as fs from "node:fs/promises";

const createWindow = async () => {
  const win = new BrowserWindow({
    icon: "/images/icon.png",
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  app.setName('Fiicen Desktop');

  win.removeMenu();

  win.loadURL("https://fiicen.jp");

  fs.readFile("settings.json").then(() => {
    console.log("File reading completed!")
  }).catch((err) => {
    if (err.toString().startsWith("Error: ENOENT: ")) {
      console.warn("settings.json not found; creating settings.json")
      fs.writeFile("settings.json", JSON.stringify({custom_css: ""}))
    } else {
      console.warn("Error: SRE_UNKNOWN: ", err.toString())
    }
  })

  win.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      win.webContents.isDevToolsOpened()
        ? win.webContents.closeDevTools()
        : win.webContents.openDevTools({ mode: "left" });
    }
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (!url.startsWith("https://fiicen.jp")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });
};

app.whenReady().then(() => {
  createWindow();
});