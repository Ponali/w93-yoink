function addToObject(name,id,content){
	return new Promise(resolve=>{
    	openJSON(name,cont=>{
        	cont[id]=content;
        	writeJSON(name,cont,resolve);
        })
    })
}
function addToBoot(id,content){
	runCodeString(content);
	return addToObject("boot",id,content);
}
async function addToLib(id,content){
	runLib(id,content);
	return addToObject("lib",id,content);
}
function addApps(id,apps){
	return new Promise(resolve=>{
		initAllPackageApps(apps);
		openJSON("apps",cont=>{
    		if(!cont[id]) cont[id]=[];
			for(let i in apps){
    			cont[id].push(apps[i])
    		}
    		writeJSON("apps",cont,resolve)
    	})
    });
}
function addToDepend(id,depends){
	return addToObject("depend",id,depends);
}
async function installPackage(pack){
	log("Installing "+pack.meta.id+"...");
	console.log(pack.content);
	// package may use its own library with the boot script, so library goes first
	if(pack.content.lib) await addToLib(pack.meta.id,pack.content.lib);
	if(pack.content.boot) await addToBoot(pack.meta.id,pack.content.boot);
	await addApps(pack.meta.id,pack.content.apps);
	await addToDepend(pack.meta.id,pack.depend);
	return;
};
async function installPackageLoop(packs){
	for(let i in packs){
    	await installPackage(packs[i]);
    }
}
function installAskUser(ask,callback){
	if(ask){
		question("Additional packages will be installed if you proceed. Continue?",input=>{
    		if(input){
        		callback();
        	}
    	});
    } else {
    	callback();
    }
}
function addToUserInstalled(packids,callback){
	openJSON("userinstalled",cont=>{
    	cont=cont.concat(packids);
    	cont=[...new Set(cont)];
    	writeJSON("userinstalled",cont,callback);
    })
}
function installPackages(packids){
	scanDependencyTree(packids,packs=>{
    	console.log(packs);
    	$log(packs.length+" package(s) found: "+packs.map(a=>a.meta.id).join(" "));
    	installAskUser(packs.length>packids.length,()=>{
        	installPackageLoop(packs).then(()=>{
            	addToUserInstalled(packids,()=>{
                	saveData();
                })
            })
        })
    })
}