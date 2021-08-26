import en from "./langs/en";
import fa from "./langs/fa";

let lang = "en";
let lines = en;
switch (lang) {
    case "fa":
        lines = fa;
        break;
    default :
        lines = en;
        break;
}

export const language = lines;