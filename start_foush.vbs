Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this VBS script is located
scriptPath = fso.GetParentFolderName(WScript.ScriptFullName)

' 1. Check if Node.js is installed on the system
Dim nodeInstalled
nodeInstalled = True

On Error Resume Next
WshShell.Run "node -v", 0, True
If Err.Number <> 0 Then
    nodeInstalled = False
End If
On Error GoTo 0

' 2. If Node.js is not installed, prompt the user to install the bundled version
If Not nodeInstalled Then
    Dim response
    response = MsgBox("برنامج Node.js غير مثبت على هذا الجهاز، وهو ضروري لتشغيل النظام." & vbCrLf & _
                      "هل تريد تثبيت برنامج Node.js المرفق بالفولدر الآن؟" & vbCrLf & vbCrLf & _
                      "Node.js is not installed. Do you want to install the bundled Node.js now?", _
                      vbYesNo + vbQuestion + vbSystemModal, "تثبيت Node.js / Node.js Setup")
                      
    If response = vbYes Then
        ' Determine if system is 64-bit or 32-bit to choose correct installer
        Dim arch, msiName
        arch = WshShell.ExpandEnvironmentStrings("%PROCESSOR_ARCHITECTURE%")
        If InStr(arch, "64") > 0 Or WshShell.ExpandEnvironmentStrings("%PROCESSOR_ARCHITEW6432%") <> "%PROCESSOR_ARCHITEW6432%" Then
            msiName = "node-v13.14.0-x64.msi"
        Else
            msiName = "node-v13.14.0-x86.msi"
        End If
        
        Dim installerPath
        installerPath = scriptPath & "\" & msiName
        
        If fso.FileExists(installerPath) Then
            MsgBox "سيتم الآن فتح معالج التثبيت. يرجى المتابعة والضغط على Next حتى النهاية." & vbCrLf & vbCrLf & _
                   "The setup wizard will now open. Please complete the installation steps.", vbInformation + vbSystemModal, "تنبيه / Notice"
            
            ' Run MSI installer and wait for it
            WshShell.Run "msiexec /i """ & installerPath & """", 1, True
            
            MsgBox "تم تثبيت Node.js بنجاح!" & vbCrLf & "يرجى إعادة تشغيل ملف start_foush.vbs لتشغيل برنامج الكاشير." & vbCrLf & vbCrLf & _
                   "Node.js installed successfully! Please run start_foush.vbs again.", vbInformation + vbSystemModal, "اكتمل التثبيت / Setup Complete"
        Else
            MsgBox "لم يتم العثور على ملف التثبيت: " & msiName & vbCrLf & "يرجى التأكد من وجوده في الفولدر الرئيسي.", vbCritical + vbSystemModal, "خطأ / Error"
        End If
    End If
    WScript.Quit
End If

' 3. Create or update the Desktop shortcut pointing to this VBS script
Dim strDesktop, shortcutPath, oMyShortcut
strDesktop = WshShell.SpecialFolders("Desktop")
shortcutPath = strDesktop & "\Foush POS.lnk"

Set oMyShortcut = WshShell.CreateShortcut(shortcutPath)
oMyShortcut.TargetPath = WScript.ScriptFullName
oMyShortcut.WorkingDirectory = scriptPath
If fso.FileExists(scriptPath & "\logo.ico") Then
    oMyShortcut.IconLocation = scriptPath & "\logo.ico"
End If
oMyShortcut.Save

' 4. Run the Node.js server silently in the background (0 means hidden window)
WshShell.Run "cmd /c cd /d """ & scriptPath & "\local-server"" && node server.js", 0, False

' 5. Wait 3.5 seconds for the server to start
WScript.Sleep 3500

' 6. Locate Chrome path dynamically or fallback to default browser
Dim chromeCmd, chromeFound, pathVal, randNum
chromeFound = False

Randomize
randNum = Int((999999 - 100000 + 1) * Rnd + 100000)

' Check common registry/file locations for Google Chrome
Dim commonPaths
commonPaths = Array( _
    "C:\Program Files\Google\Chrome\Application\chrome.exe", _
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", _
    WshShell.ExpandEnvironmentStrings("%LocalAppData%") & "\Google\Chrome\Application\chrome.exe" _
)

For Each pathVal In commonPaths
    If fso.FileExists(pathVal) Then
        chromeCmd = """" & pathVal & """ --app=http://localhost:3000/index.html?t=" & randNum
        chromeFound = True
        Exit For
    End If
Next

' If not found in common folders, try to just run chrome.exe (maybe in path)
If Not chromeFound Then
    chromeCmd = "chrome.exe --app=http://localhost:3000/index.html?t=" & randNum
End If

' Execute Chrome, and if it fails (not found or error), use default browser
On Error Resume Next
WshShell.Run chromeCmd, 1, False
If Err.Number <> 0 Then
    ' Chrome failed, fallback to default browser
    Err.Clear
    WshShell.Run "http://localhost:3000/index.html?t=" & randNum, 1, False
End If
On Error GoTo 0
