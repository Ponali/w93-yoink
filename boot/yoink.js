(()=>{

let files=[];

function multipleFileLoad(fileList,i,callback){
	$file.open(fileList[i],content=>{
    	files.push("// "+fileList[i]+"\n\n"+content);
    	i++;
    	if(i>=fileList.length){
        	callback();
        } else {
        	multipleFileLoad(fileList,i,callback);
        }
    })
};

function makeSingularCode(){
	return files.join("\n\n");
}

function load(callback){
	const path="/a/yoink/run/";
	let fileList=$fs.utils.iteratePath(path).files.map(a=>path+a);
	fileList=fileList.sort((a,b)=>a.endsWith("main.js")-b.endsWith("main.js"));
    multipleFileLoad(fileList,0,()=>{
    	callback(new Function("reloadFunc",makeSingularCode()));
    });
};
  
function loadRoutine(){
	files=[];
	load(out=>{
		le._apps["yoink"].exec=out(loadRoutine);
	});
};
loadRoutine();

le._apps["yoink"]={
	exec:(()=>{
		$log("Not ready");
	})
};
  
})();