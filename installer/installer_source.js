let bootScriptFunction=_bootScriptFunction;
let bootScript=""+bootScriptFunction;
async function setup(saveFile,makeFolder,version){
    switch(version){
        case "v2":{
            await saveFile("/a/boot/yoink.js",`(${bootScript})()`);
            await saveFile("/a/yoink/settings/mirrors.txt",_mirrorsDefault)
            break;
        }
    }
}
async function prepare(){
    let finishMsg="Yoink has been successfully installed in your computer.\nPlease restart your computer to use Yoink.";
    if(globalThis["$file"]){
        await setup((path,content)=>{
            return new Promise(resolve=>{
                $file.save(path,content,resolve);
            })
        },()=>{},"v2");
        $alert(finishMsg);
    } else {
        alert("This version of Windows93 is unknown or incompatible.");
    }
}
prepare();