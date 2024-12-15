let bootScriptFunction=_bootScriptFunction;
let bootScript=""+bootScriptFunction;
async function setup(saveFile,makeFolder,version){
    bootScriptFunction();
    switch(version){
        case "v2":{
            // folders are automatically made in v2, no need to use makeFolder
            await saveFile("/a/boot/yoink.js",`(${bootScript})()`);
            await saveFile("/a/yoink/settings/mirrors.txt",_mirrorsDefault);
            le._apps.yoink.exec.bind({cli:{cfg:{cwd:"/a/"}},arg:{arguments:{},options:{"m":true}}})();
            break;
        }
    };
}
async function prepare(){
    let finishMsg="Yoink has been successfully installed in this system. Now shortly rebooting...";
    if(globalThis["$file"]){
        await setup((path,content)=>{
            return new Promise(resolve=>{
                $file.save(path,content,resolve);
            })
        },()=>{},"v2");
        alert(finishMsg);
        location.hash="";
        location.reload();
    } else {
        alert("This version of Windows93 is unknown or incompatible.");
    }
}
prepare();
