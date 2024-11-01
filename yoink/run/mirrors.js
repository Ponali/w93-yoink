var mirrorlist=[];
onDataReady.push(()=>{
	console.log("Data ready!")
	openJSON("mirrors",a=>{
    	console.log("mirrors:",a)
    	mirrorlist=a;
    })
})

function updateMirrorList(newlist){
	mirrorlist=newlist;
}

function parseMirrorTxt(callback){
	openFile("/a/yoink/settings/mirrors.txt","String",content=>{
    	let lines=content.split("\n");
    	lines=lines.map(a=>a.includes("#")?a.slice(0,a.indexOf("#")):a); // remove comments
    	lines=lines.filter(a=>a.replaceAll(" ","")); // remove empty lines
    	callback(lines)
    })
}

function joinURL(url,file){
	if(url[url.length-1]!="/") url+="/";
	url+=file;
	return url;
}

function getSpeedLink(link){
	return joinURL(link,"yoink.txt");
}

function getMirrorSpeed(useLink,callback){
	let start=Date.now();
	let link=getSpeedLink(useLink);
	log("fetching "+link)
	fetch(link).then(a=>{
    	if(!a.ok){
        	if(a.status==404){
            	log.error("Does not exist (404)\nPlease check if your internet is still up or if the server supports Yoink.");
            } else if(a.status>=500) {
            	log.error(`Unavailable (${a.status})`);
            	callback({url:useLink,time:Infinity});
            	return;
            } else {
            	log.error(`Invalid (${a.status})`);
            };
        	callback();
        } else {
        	a.text().then(txt=>{
            	let fetchTime=Date.now()-start;
            	log("time: "+fetchTime);
            	callback({url:useLink,time:fetchTime});
            })
        }
    }).catch(e=>{
    	if(e.message.startsWith("Failed to fetch")){
        	log.error(`"Failed to fetch" (${e.message.slice(15)}) error.\nFor more information, please check the DevTools console (Ctrl+Shift+I / F12)`);
        } else {
    		log.error("Fetch API Error:\n"+(e.stack?e.stack:e));
        };
    	callback();
    })
};

function getAllMirrorSpeeds(links,i,callback){
	let mirrorspeeds=[];
	getMirrorSpeed(links[i],out=>{
    	if(out) mirrorspeeds.push(out);
    	i++;
    	if(i>=links.length){
        	callback(mirrorspeeds);
        } else {
        	getAllMirrorSpeeds(links,i,callback);
        }
    })
}

function updateMirrors(){
	parseMirrorTxt(links=>{
    	getAllMirrorSpeeds(links,0,mirrors=>{
        	mirrors=mirrors.sort((a,b)=>a.time-b.time);
        	if(mirrors.length==0){
            	log.error("No mirrors found. Make sure your internet connection is still up, or you didn't make a mistake when typing the URLs.");
            } else {
            	log("Found "+mirrors.length+" valid mirror(s)");
            	updateMirrorList(mirrors);
            	writeJSON("mirrors",mirrors,()=>{
                	saveData();
                	log("Successfully updated mirror list.");
                });
            }
        })
    })
};

function fetchMirror(mirror,file, callback){
	console.log(mirror);
	let useLink=joinURL(mirror.url,file);
	fetch(useLink).then(a=>{
    	if(!a.ok){
        	log.error(`${file} unavailable (${(new URL(mirror)).host})`);
        	callback();
        } else {
        	a.blob().then(blb=>{
            	callback(blb);
            })
        }
    }).catch(e=>{
    	if(e.message.startsWith("Failed to fetch")){
        	log.error(`"Failed to fetch" (${e.message.slice(15)}) error.\nFor more information, please check the DevTools console (Ctrl+Shift+I / F12)`);
        } else {
    		log.error("Fetch API Error:\n"+(e.stack?e.stack:e));
        };
    	callback();
    })
}

function fetchAcrossMirrors(file,i,callback){
	if(mirrorlist.length==0){
    	log.error("There are no mirrors set up. Either something wrong happened, or you forgot to insert some mirrors and enter 'yoink -m'.");
    	return;
    }
	let mirror=mirrorlist[i];
	fetchMirror(mirror,file,content=>{
    	console.log(content);
    	if(content){
        	callback(content);
        } else {
        	i++;
        	if(i>=mirrorlist.length){
              log.error("Cannot find file ("+file+") from available mirrors: Installation cancelled")
              return;
            }
        	fetchAcrossMirrors(file,i,callback)
        }
    })
}