let UglifyJS=require("uglify-js");
let argv=require("minimist")(process.argv.slice(2));

let fs=require("fs");

function minify(code,drop_console){
    console.log("[Minifying content]");
    let result=UglifyJS.minify(code,{compress:{toplevel:true,drop_console},mangle:{toplevel:true}});
    if(result.error) throw result.error;
    return result.code;
}
function makeBootScript(){
    let path="../yoink/run/";
    let fileList=fs.readdirSync(path).sort().map(a=>path+a);
    fileList=fileList.sort((a,b)=>a.endsWith("main.js")-b.endsWith("main.js"));
    let files=[];
    for(let i=0;i<fileList.length;i++){
        files.push(fs.readFileSync(fileList[i]).toString("utf8"));
    };
    let code=files.join("\n");
    code=`function addToSession(exec){le._apps["yoink"]={exec}};addToSession(((reloadFunc)=>{${code}})(()=>{}))`;

    return minify(code,true);
}
function makeInstaller(bootScript){
    let ins=fs.readFileSync("installer_source.js").toString("utf8");
    ins=ins.replace("_mirrorsDefault",JSON.stringify(fs.readFileSync("../yoink/settings/mirrors.txt").toString("utf8")))
    let minified=minify(ins,false);
    //console.log(minified);
    return minified.replace("_bootScriptFunction",`(()=>{${bootScript}})`);
}
function compressPackJS(codeStr){
    // compresses javascript code and packs it to decompress and launch when ran.
    const cmp=require("zlib").deflateSync(codeStr);
    const cmpStr=`atob(${JSON.stringify(cmp.toString("base64"))}).split("").map(a=>a.charCodeAt())`;
    const out=minify(`(()=>{${fs.readFileSync("pako_inflate.min.js").toString("utf8")}})();`
        +`(new Function(pako.inflate(new Uint8Array(${cmpStr}),{to:"string"})))()`,true);
    if(out.length>codeStr){
        console.warn("Packing content led to higher size - Resorting to original code");
        return codeStr
    } else return out;
}
let time=Date.now();
console.log("Making boot script...");
let bootScript=makeBootScript();
console.log("Making installer...");
let ins=makeInstaller(bootScript);
console.log("Packing...");
let insFinal=compressPackJS(ins);
console.log("Saving...");
fs.writeFileSync((argv.o||argv.output||argv._[0]||"out.js"),insFinal);
console.log(`Made Yoink installer in ${(Date.now()-time)/1000} seconds`)