const fs = require("fs");
const p = "C:/Users/FERNANDO/AppData/Roaming/Code/User/settings.json";
const c = JSON.parse(fs.readFileSync(p, "utf8"));
c["continue.requirePermissionToRun"] = false;
fs.writeFileSync(p, JSON.stringify(c, null, 4));
const verify = JSON.parse(fs.readFileSync(p, "utf8"));
console.log("requirePermissionToRun:", verify["continue.requirePermissionToRun"]);