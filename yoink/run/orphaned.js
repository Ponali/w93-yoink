function getOrphanedPackages(){
	return new Promise(resolve=>{
		openJSON("depend",depend=>{
    		openJSON("userinstalled",userinstalled=>{
        		/*
            		Algorithm:
					- Go through each package and add their dependencies into a list
					- Make a second list of packages that wasn't in that other list
					- Remove user-installed packages from the second list
					- The second list is the list of all the orphaned
            	*/
        		let packageList=Object.keys(depend);
            	console.log(packageList);
        		let listA=[...new Set(packageList.map(a=>depend[a]).flat())];
        		let listB=packageList.filter(a=>!listA.includes(a));
        		listB=listB.filter(a=>!userinstalled.includes(a));
            	console.log("orphaned packages found",listB);
        		resolve(listB);
        	})
    	});
    })
}