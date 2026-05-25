Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "c:\Users\dell\Desktop\foush"
WshShell.Run "cmd /c python local_server.py", 0, False
WScript.Sleep 2000
WshShell.Run "chrome --app=http://localhost:8000/?app=foush", 1, False
