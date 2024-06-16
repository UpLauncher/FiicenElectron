import { app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import axios from "axios";
import { Menu } from "electron/main";
import * as fs from "node:fs/promises";
import { Logger } from "./utils/logger";
import * as child from "child_process"

const createWindow = async () => {
  const win = new BrowserWindow({
    icon: "images/icon.png",
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/preload.js`,
    },
  });

  app.setName("Fiicen Desktop");

  const menuTemplate: Menu = Menu.buildFromTemplate([
    {
      label: "戻る",
      enabled: win.webContents.canGoBack(),
      click() {
        win.webContents.goBack();
      },
    },
    {
      label: "進む",
      enabled: win.webContents.canGoForward(),
      click() {
        win.webContents.goForward();
      },
    },
  ]);

  const logger = new Logger("Updater");

  const updateBaseUrl = "https://api.raic.tech/fiicenElectron/checkForUpdates";
  const updateParameterUrl = `?app_version=${app.getVersion()}&platform=${
    process.platform
  }`;
  const updateUrl = updateBaseUrl + updateParameterUrl;
  logger.info("Checking for updates... URL:", updateUrl)
  axios
    .get(
      updateUrl
    )
    .then((res) => {
      if (!res.data.isLatest) {
        logger.warn("Updates are available.\n", "Current Version:", app.getVersion(), "\nNew Version:", res.data.newVersion)

        dialog.showMessageBox(win, {title: "アップデートが利用可能です", message: `新しいFiicen Desktopのバージョンが利用できるようになりました。アップデートしますか？\n現在のバージョン: ${app.getVersion()}\n新しいバージョン: ${res.data.newVersion}`, buttons: ["アップデート", "キャンセル"], defaultId: 0, cancelId: 1}).then((result) => {
          if (result.response == 0) {
            logger.info("User requested update: Installer URL is open...")
            
            child.exec("start " + res.data.downloadUrl);
          }
        })

        logger.info("Message displayed.")
      } else {
        logger.info("using the latest version!");
      }
    }).catch((reason) => {
      logger.error("An error occurred while checking for updates:", reason)
    });

  Menu.setApplicationMenu(menuTemplate);

  win.loadURL("https://fiicen.jp");

  fs.readFile(process.resourcesPath + "\\settings.json")
    .then(() => {
      console.log(process.resourcesPath);
      console.log("File reading completed!");
    })
    .catch((err) => {
      if (err.toString().startsWith("Error: ENOENT: ")) {
        console.warn("settings.json not found; creating settings.json");
        fs.writeFile(
          process.resourcesPath + "\\settings.json",
          JSON.stringify({ custom_css: "" })
        );
      } else {
        console.warn("Error: SRE_UNKNOWN: ", err.toString());
      }
    });

  win.webContents.on("before-input-event", (_, input) => {
    if (input.type === "keyDown" && input.key === "F12") {
      win.webContents.isDevToolsOpened()
        ? win.webContents.closeDevTools()
        : win.webContents.openDevTools();
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
  ipcMain.handle("getAppPath", () => process.resourcesPath);

  if (require("electron-squirrel-startup")) {
    app.quit();
  }
  createWindow();
});
