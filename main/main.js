const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:5173"); // React dev server
}

// 👇 Levantar el backend al iniciar Electron
function startBackend() {
  const backend = spawn("node", ["server/index.js"], {
    shell: true,
    stdio: "inherit",
  });

  backend.on("close", (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

app.whenReady().then(() => {
  createWindow();   // 🖼️ Lanzamos frontend
});
