function getFile(name,callback){
	//$log(name);
	if(isFile(path+"/"+name+".ynk")){
    	$file.open(path+"/"+name+".ynk","Blob",out=>{
        	callback(out);
        })
    } else if(isFile(path+"/"+name)){
    	$file.open(path+"/"+name,"Blob",out=>{
        	callback(out);
        })
    } else {
    	fetchAcrossMirrors(name+".ynk",0,out=>{
        	callback(out);
        })
    }
};
function getPackageInfo(id){
	return new Promise(callback=>{
		getFile(id,out=>{
    		let pack=new PackageFile();
        	pack.init(out).then(()=>{
            	callback(pack);
        	});
   		});
    });
};
async function scanDependencyTreeAsync(ids){
	let depends=[];
	for(let i in ids){
    	let id=ids[i];
    	if(depends.includes(id)) continue;
      	let pack=await getPackageInfo(id);
      	depends.unshift(pack);
    	let deps=await scanDependencyTreeAsync(pack.depend);
    	depends=depends.concat(deps);
    };
	return depends;
}
function scanDependencyTree(ids,callback){
	scanDependencyTreeAsync(ids).then(callback);
};