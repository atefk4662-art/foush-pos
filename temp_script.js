
        window.onerror = function (msg, url, lineNo, columnNo, error) {
            document.body.innerHTML = '<div style="color:white; background:red; padding:20px; z-index:999999; position:fixed; top:0; left:0; width:100%; height:100%; overflow:auto;"><h2>CRITICAL ERROR</h2><p>' + msg + '</p><p>Line: ' + lineNo + '</p><pre>' + (error && error.stack ? error.stack : '') + '</pre></div>';
            return false;
        };
    