const colorLog = (message, color) => {
    const logColor = {    
        reset : "\x1b[0m",
        black : "\x1b[30m",
        red : "\x1b[31m",
        green : "\x1b[32m",
        yellow : "\x1b[33m",
        blue : "\x1b[34m",
        magenta : "\x1b[35m",
        cyan : "\x1b[36m",
        white : "\x1b[37m"
    }
    color = color? color in logColor? logColor[color] : logColor.black : logColor.black;
    return message? console.log(color, message , logColor.reset ) : null;
}

module.exports = colorLog;