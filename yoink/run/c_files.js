/*const basepath="/a/yoink/";
const bootfilename=basepath+"boot.json";
const libfilename=basepath+"lib.json";
const appfilename=basepath+"apps.json";
const savefilename=basepath+"save.json";
const usrinsfilename=basepath+"userinstalled.json";
const dependfilename=basepath+"depend.json";*/

let datafilename="/a/yoink/data";
let dataZip;
let onDataReady=[];
function handleData(zip,save){
	function fileDefault(name,def){
    	if(!zip.file(name)){
        	console.log(name+" not found, setting to "+def);
        	zip.file(name,def);
        }
    }
    ["apps","boot","depend","lib","save"].forEach(item=>{
    	fileDefault(item,"{}");
    });
    ["mirrors","userinstalled"].forEach(item=>{
        fileDefault(item,"[]");
    });
  	dataZip=zip;
	if(save) saveData();
	onDataReady.forEach(a=>a());
}
if(fileExists(datafilename)){
	openFile(datafilename,"Blob",blob=>{
    	JSZip.loadAsync(blob).then(handleData)
    })
} else {
	// make file
	console.log("Cannot find data file! Now making a new file.")
	handleData(new JSZip(),true)
}
function openJSON(name,callback){
	dataZip.file(name).async("string").then(str=>{
    	callback(JSON.parse(str));
    })
}
function writeJSON(name,content,callback){
	console.log(name,"->",content);
	dataZip.file(name,JSON.stringify(content))
    callback();
}
function saveData(){
	dataZip.generateAsync({
    	type: "blob",
    	compression: "DEFLATE",
    	compressionOptions: {
        	level: 9
    	}
	}).then(blob=>{
    	writeFile(datafilename,blob,()=>{
        	console.log("Saved data file.")
        })
    })
}
console.log("open",openJSON);
console.log("write",writeJSON);
console.log("save",saveData);