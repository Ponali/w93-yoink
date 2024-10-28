function removeFromObject(name,id){
	return new Promise(resolve=>{
		openJSON(name,cont=>{
    		if(cont[id]){
    			delete cont[id];
        		writeJSON(name,cont,resolve);
        	} else {resolve();}
    	})
    });
}
function removeBoot(id){
	return removeFromObject("boot",id);
};
function removeLib(id){
	return removeFromObject("lib",id);
};
function removeFromDepend(id){
	return removeFromObject("depend",id);
}
function removeApps(id){
	return new Promise(resolve=>{
    	openJSON("apps",cont=>{
        	if(cont[id]){
                // remove all apps from session
                let apps=cont[id];
                for(let i in apps){
                   	removeAppFromSession(apps[i].name);
                }
                // remove apps from json file
                delete cont[id];
          		writeJSON("apps",cont,resolve);
            } else {resolve();}
        })
    })
};
function removePackageSave(id){
	return new Promise(resolve=>{
    	openJSON("save",cont=>{
        	let change=false;
            for(let i in cont){
               	if(i.toString().startsWith(id+" ")){
                   	delete cont[i];
                   	change=true;
                }
            }
			if(change) writeJSON("save",cont,resolve);
        })
    })
};
function removeUserInstalled(id){
	return new Promise(resolve=>{
    	openJSON("userinstalled",cont=>{
        	if(cont.includes(id)) cont.splice(cont.indexOf(id),1);
			writeJSON("userinstalled",cont,resolve);
        })
    })
}

async function removeSinglePackage(id,removeSave){
	await removeBoot(id);
	await removeLib(id);
    await removeApps(id);
	await removeUserInstalled(id);
	await removeFromDepend(id);
	if(removeSave) await removePackageSave(id);
};

async function removePackageArray(ids,removeSave){
	for(let i in ids){
    	await removeSinglePackage(ids[i],removeSave);
    };
};

async function removePackageCmd(args,flags){
	// settings
	let removeSave=false;
	if(flags.a||flags.additional_data) removeSave=true;
	let orphaned=false;
	if(flags.o||flags.orphaned) orphaned=true;
	
	// do stuff
	await removePackageArray(args,removeSave);
	if(orphaned){
    	let orphanedPacks=await getOrphanedPackages();
        await removePackageArray(orphanedPacks,removeSave);
    };
	saveData();
}