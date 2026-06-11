Set WshShell = CreateObject("WScript.Shell")
' Run the Node.js server silently in the background (0 means hidden window)
WshShell.Run "cmd /c cd /d ""C:\Users\dell\Desktop\foush\local-server"" && node server.js", 0, False

' Wait 1 second for the server to start
WScript.Sleep 1000

' Open Google Chrome in App Mode (looks like a native app with its own taskbar icon)
WshShell.Run "chrome.exe --app=http://localhost:3000/pos.html", 1, False
