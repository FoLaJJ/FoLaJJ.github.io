function makeMulti (string) {
    let l = new String(string)
    l = l.substring(l.indexOf("/*") + 3, l.lastIndexOf("*/"))
    return l
}
let string = function () {
  /*
      ___         ___                         ___         ___        ___    
     /  /\       /  /\                       /  /\       /  /\      /  /\   
    /  /:/_     /  /::\                     /  /::\     /  /:/     /  /:/   
   /  /:/ /\   /  /:/\:\    ___     ___    /  /:/\:\   /__/::\    /__/::\   
  /  /:/ /:/  /  /:/  \:\  /__/\   /  /\  /  /:/~/::\  \__\/\:\   \__\/\:\  
 /__/:/ /:/  /__/:/ \__\:\ \  \:\ /  /:/ /__/:/ /:/\:\    \  \:\     \  \:\ 
 \  \:\/:/   \  \:\ /  /:/  \  \:\  /:/  \  \:\/:/__\/     \__\:\     \__\:\
  \  \::/     \  \:\  /:/    \  \:\/:/    \  \::/          /  /:/     /  /:/
   \  \:\      \  \:\/:/      \  \::/      \  \:\         /__/:/     /__/:/ 
    \  \:\      \  \::/        \__\/        \  \:\        \__\/      \__\/  
     \__\/       \__\/                       \__\/                          */
}
console.log(makeMulti(string));
console.log(/* 其他信息 */);