import * as fs from "node:fs/promises";
import * as child from "node:child_process";
import { App, contextBridge, ipcRenderer } from "electron";
import { Logger } from "./utils/logger";

let getAppPath = "";

document.addEventListener("DOMContentLoaded", async () => {
  getAppPath = await ipcRenderer.invoke("getAppPath");
  const observer = new MutationObserver(callback);
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(document.body, config);
});

window.addEventListener("load", () => {
  const logger = new Logger("fileLoader");
  if (!document.querySelector("style.desktop-added-style")) {
    const settingsJsonPath = getAppPath + "\\settings.json";
    logger.info(`Load Configuration: (${settingsJsonPath})`);
    fs.readFile(settingsJsonPath)
      .then((file) => {
        logger.info(
          `configuration loading completed. (${settingsJsonPath})`
        );
        const json = JSON.parse(file.toString());

        //Style (Custom CSS)
        const style = document.createElement("style");
        style.classList.add("desktop-added-style");
        style.innerHTML = json.custom_css;
        document.body.appendChild(style);

        //
        logger.info(
          `configuration setting apply complete. (${settingsJsonPath})`
        );
      })
      .catch((err) => {
        if (err.toString().startsWith("ENOENT: ")) {
          logger.warn("settings.json not found; creating settings.json");
          fs.writeFile(
            getAppPath + "\\settings.json",
            JSON.stringify({ custom_css: "" })
          );
        } else {
          logger.warn("Error: setting read error");
        }
      });
  }
});

function callback() {
  const copyright = document.querySelectorAll("div.copyright");
  copyright.forEach((element) => {
    if (!element.classList.contains("desktop-added-copyright")) {
      if (element.parentElement?.classList.contains("footer")) {
        element.classList.add("desktop-added-copyright");
        element.innerHTML += ` (Desktop made by <a href="/field/raic" class="link">@raic</a>!)`;
      } else {
        element.classList.add("desktop-added-copyright");
        element.innerHTML += `<br>Fiicen Desktop made by <a href="/field/raic" class="link">@raic</a>!`;
      }
    }
  });

  if (window.location.href.startsWith("https://fiicen.jp/settings/")) {
    const settingsMenu = document.querySelector("div.settings-menu");
    if (!settingsMenu?.classList.contains("desktop-added-content")) {
      settingsMenu?.classList.add("desktop-added-content");
      const settingsElement = document.createElement("div");
      const settingsTitle = document.createElement("div");
      const settingsImg = document.createElement("img");
      settingsElement.classList.add(
        "settings-menu-item",
        "settings-desktop-setting"
      );
      settingsElement.addEventListener("click", () => {
        addDesktopElements(settingsElement);
      });
      settingsTitle.innerHTML = "Desktopの設定";
      settingsImg.src = "/static/icon/right.svg";
      settingsElement.appendChild(settingsTitle);
      settingsElement.appendChild(settingsImg);
      settingsMenu?.appendChild(settingsElement);

      settingsMenu?.querySelectorAll("div.settings-menu-item").forEach((e) => {
        e.addEventListener("click", () => {
          const target = e as HTMLElement;
          if (target.classList.contains("selected")) {
            settingsMenu
              .querySelector(".settings-desktop-setting")
              ?.classList.remove("selected");
            target.classList.add("selected");
          }
        });
      });

      // if (window.location.href == "https://fiicen.jp/settings/desktop/") {
      //   addDesktopElements(settingsElement);
      //   // @ts-ignore
      //   navigation.addEventListener("navigate", () => {
      //     settingsElement.classList.remove("selected")
      //   });
      // }
    }
  }

  if (window.location.href == "https://fiicen.jp/settings/help/") {
    const settingsContents = document.querySelector("div.settings-contents");
    const DesktopContentsInner = document.createElement("div");
    const contentsInner = document.createElement("div");
    const subTitle = document.createElement("div");
    // const menuItem = document.createElement("div");
    // const menuInner = document.createElement("div");
    // const menuItem2 = document.createElement("div");
    // const menuInner2 = document.createElement("div");
    // const menuItem3 = document.createElement("div");
    // const menuInner3 = document.createElement("div");
    // const menuItem4 = document.createElement("div");
    // const menuInner4 = document.createElement("div");

    // if (
    //   settingsContents &&
    //   !settingsContents.classList.contains("desktop-added-content") &&
    //   !settingsContents?.classList.contains("desktop-added-content-cstm")
    // ) {
    //   settingsContents.classList.add(
    //     "desktop-added-content",
    //     "settings-contents"
    //   );

    //   DesktopContentsInner.classList.add("desktop-added-help-content");

    //   //Class lists
    //   contentsInner.classList.add("settings-contents-inner");
    //   subTitle.classList.add("settings-sub-title");
    //   menuItem.classList.add("settings-menu-item");
    //   menuInner.classList.add("settings-menu-item-inner");
    //   menuItem4.classList.add("settings-menu-item");
    //   menuInner4.classList.add("settings-menu-item-inner");
    //   menuItem3.classList.add("settings-menu-item");
    //   menuInner3.classList.add("settings-menu-item-inner");
    //   menuItem2.classList.add("settings-menu-item");
    //   menuInner2.classList.add("settings-menu-item-inner");

    //   //sub title
    //   subTitle.textContent = "Fiicen Desktop";

    //   // Append Child
    //   contentsInner.appendChild(subTitle);
    //   menuItem.appendChild(menuInner);
    //   menuItem2.appendChild(menuInner2);
    //   menuItem3.appendChild(menuInner3);
    //   menuItem4.appendChild(menuInner4);

    //   // Set Menu Inner
    //   menuInner.innerHTML = `<div>OSのタイプ</div><div class="note">${process.platform}</div>`;
    //   menuInner2.innerHTML = `<div>Chromeのバージョン</div><div class="note">${process.versions.chrome}</div>`;
    //   menuInner3.innerHTML = `<div>Electronのバージョン</div><div class="note">${process.versions.electron}</div>`;
    //   menuInner4.innerHTML = `<div>作成者とクレジット</div><div class="note">Fiicen Desktopは、<a href="/field/raic/" class="link">@raic</a>によって作成されました。<br>Fiicenの運営がFiicen Desktopについてお問い合わせを希望する場合は、Xの<a href="https://x.com/raidesuuu" target="_blank" class="link">@raidesuuu</a>にお問い合わせください。</div>`;

    //   // Setting Content AppendChild
    //   DesktopContentsInner.appendChild(contentsInner);
    //   DesktopContentsInner.appendChild(menuItem);
    //   DesktopContentsInner.appendChild(menuItem2);
    //   DesktopContentsInner.appendChild(menuItem3);
    //   DesktopContentsInner.appendChild(menuItem4);
    //   settingsContents.appendChild(DesktopContentsInner);
    // }
  }
}

function addDesktopElements(settingsElement: Element) {
  const alreadyAddedSelected = document.querySelector(".selected");
  alreadyAddedSelected?.classList.remove("selected");
  settingsElement.classList.add("selected");

  // if (window.location.href != "https://fiicen.jp/settings/desktop/") {
  //   window.location.href = "https://fiicen.jp/settings/desktop/";
  // }
  // if (window.location.href == "https://fiicen.jp/settings/desktop/") {
  const settingsContentContainer = document.querySelector(
    "div.settings-contents-container"
  );
  const settingsContent = document.querySelector("div.settings-contents");
  try {
    settingsContentContainer!.innerHTML = "";
  } catch (e) {}
  if (!settingsContent?.classList.contains("desktop-added-content-cstm")) {
    document.title = "設定 - Desktopの設定 / Fiicen";
    const settingsContents = document.createElement("div");
    const settingsHeader = document.createElement("div");
    const contentsInner = document.createElement("div");
    const contentsInnerMain = document.createElement("div");
    const subTitle = document.createElement("div");
    const menuItem = document.createElement("div");
    const menuInner = document.createElement("div");
    const menuItem2 = document.createElement("div");
    const menuInner2 = document.createElement("div");
    const menuItem3 = document.createElement("div");
    const menuInner3 = document.createElement("div");
    const menuItem4 = document.createElement("div");
    const menuInner4 = document.createElement("div");
    const menuItem5 = document.createElement("div");
    const menuInner5 = document.createElement("div");
    const menuItem6 = document.createElement("div");
    const menuInner6 = document.createElement("div");

    settingsContents?.classList.add(
      "desktop-added-content-cstm",
      "settings-contents"
    );

    settingsHeader.classList.add("settings-header");
    settingsHeader.innerHTML = `<div class="settings-back" onclick="loadPage('/settings/')" ><img src="/static/icon/arrow.svg"></div><div class="settings-title">Desktopの設定</div>`;
    contentsInner.classList.add("settings-contents-inner");

    contentsInner.classList.add("settings-contents-inner");
    contentsInnerMain.classList.add("settings-contents-inner");
    subTitle.classList.add("settings-sub-title");
    menuItem.classList.add("settings-menu-item");
    menuItem2.classList.add("settings-menu-item");
    menuInner.classList.add("settings-menu-item-inner");
    menuInner2.classList.add("settings-menu-item-inner");
    menuItem3.classList.add("settings-menu-item");
    menuInner3.classList.add("settings-menu-item-inner");
    menuItem4.classList.add("settings-menu-item");
    menuInner4.classList.add("settings-menu-item-inner");
    menuItem5.classList.add("settings-menu-item");
    menuInner5.classList.add("settings-menu-item-inner");
    menuItem6.classList.add("settings-menu-item");
    menuInner6.classList.add("settings-menu-item-inner");

    subTitle.textContent = "Fiicen Desktop";

    contentsInner.appendChild(subTitle);
    menuItem.appendChild(menuInner);
    menuItem2.appendChild(menuInner2);
    menuItem3.appendChild(menuInner3);
    menuItem4.appendChild(menuInner4);
    menuItem5.appendChild(menuInner5);
    menuItem6.appendChild(menuInner6);

    contentsInnerMain.innerHTML =
      '<div class="note">Fiicen Desktopの機能を利用しましょう</div>';
    menuInner.innerHTML = `<div>カスタムCSS</div><div class="note">このアプリの実行フォルダにある「settings.json」のcustom_cssを編集してください。<br>例: {"custom_css": "body {background-color: red}"}</div>`;
    menuInner2.innerHTML = `<div>settings.jsonを開く</div><div class="note">クリックして「settings.json」を開きます。</div>`;
    menuInner3.innerHTML = `<div>OSのタイプ</div><div class="note">${process.platform}</div>`;
    menuInner4.innerHTML = `<div>Chromeのバージョン</div><div class="note">${process.versions.chrome}</div>`;
    menuInner5.innerHTML = `<div>Electronのバージョン</div><div class="note">${process.versions.electron}</div>`;
    menuInner6.innerHTML = `<div>作成者とクレジット</div><div class="note">Fiicen Desktopは、<a href="/field/raic/" class="link">@raic</a>によって作成されました。<br>Fiicenの運営がFiicen Desktopについてお問い合わせを希望する場合は、Xの<a href="https://x.com/raidesuuu" target="_blank" class="link">@raidesuuu</a>にお問い合わせください。</div>`;

    settingsContents.appendChild(settingsHeader);
    settingsContents.appendChild(contentsInnerMain);
    settingsContents.appendChild(contentsInner);
    settingsContents.appendChild(menuItem2);
    settingsContents.appendChild(menuItem);
    settingsContents.appendChild(menuItem3);
    settingsContents.appendChild(menuItem4);
    settingsContents.appendChild(menuItem5);
    settingsContents.appendChild(menuItem6);
    settingsContentContainer?.appendChild(settingsContents);

    menuItem2.innerHTML += '<img src="/static/icon/right.svg">';

    menuItem2.addEventListener("click", () => {
      child.exec("start \"" + getAppPath + "\\settings.json\"");
    });

    // settingsContents.classList.add(
    //   "settings-contents"
    // );
    // settingsTitle.innerHTML = "Desktopの設定";
    // settingsElement.appendChild(settingsTitle);
    // settingsContentContainer?.appendChild(settingsElement);
    //  }
  }
}
