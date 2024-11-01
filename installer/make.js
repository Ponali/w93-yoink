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
    code=`((reloadFunc)=>{${code}})(()=>{})`;

    return minify(code,true);
}
function makeInstaller(bootScript){
    let ins=fs.readFileSync("installer_source.js").toString("utf8");
    ins=ins.replace("_mirrorsDefault",JSON.stringify(fs.readFileSync("../yoink/settings/mirrors.txt").toString("utf8")))
    let minified=minify(ins,false);
    //console.log(minified);
    return minified.replace("_bootScriptFunction",`(()=>{${bootScript}})`);
}
let time=Date.now();
console.log("Making boot script...");
let bootScript=makeBootScript();
console.log("Making installer...");
let ins=makeInstaller(bootScript);
console.log("Saving...");
fs.writeFileSync((argv.o||argv.output||argv._[0]||"out.js"),ins);
console.log(`Made Yoink installer in ${(Date.now()-time)/1000} seconds`)