import os
import winreg

folder = r"c:\Users\dell\Desktop\foush"
vbs_launcher = os.path.join(folder, "start_foush.vbs")
icon_path = os.path.join(folder, "logo.ico")

launcher_code = f"""Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "{folder}"
WshShell.Run "cmd /c python local_server.py", 0, False
WScript.Sleep 2000
WshShell.Run "chrome --app=http://localhost:8000/?app=foush", 1, False
"""

with open(vbs_launcher, "w", encoding="utf-8") as f:
    f.write(launcher_code)

def get_desktop_path():
    try:
        key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders")
        val = winreg.QueryValueEx(key, "Desktop")[0]
        return os.path.expandvars(val)
    except:
        return os.path.join(os.environ["USERPROFILE"], "Desktop")

desktop = get_desktop_path()

shortcut_creator = os.path.join(folder, "create_shortcut.vbs")
shortcut_path = os.path.join(desktop, "FOUSH POS.lnk")

shortcut_code = f"""Set WshShell = CreateObject("WScript.Shell")
Set Shortcut = WshShell.CreateShortcut("{shortcut_path}")
Shortcut.TargetPath = "wscript.exe"
Shortcut.Arguments = Chr(34) & "{vbs_launcher}" & Chr(34)
Shortcut.WorkingDirectory = "{folder}"
Shortcut.IconLocation = "{icon_path}"
Shortcut.Save
"""

with open(shortcut_creator, "w", encoding="utf-8") as f:
    f.write(shortcut_code)

os.system(f'cscript //nologo "{shortcut_creator}"')
try:
    os.remove(shortcut_creator)
except:
    pass
