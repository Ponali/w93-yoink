let errors=[];

function getSaveFile(callback){
	openJSON("save",content=>{
    	callback(content);
    })
}
class SaveManager{
	constructor(id,appID){ // scary!!
    	this.id=id;
    	this.appID=appID;
    	this.checkStr=id+" "+appID;
    }
	exists(name,callback){
    	getSaveFile(content=>{
        	let data=content[this.checkStr];
        	if(!data) data={};
        	if(data[name]){
              	callback(true);
            } else {
            	callback(false);
            }
        })
    }
	get(name,callback){
    	getSaveFile(content=>{
        	let data=content[this.checkStr];
        	if(!data){
            	callback(undefined,new Error("Cannot get "+name+" because "+this.id+" was not initiated"))
            }
        	if(typeof(data[name])!="undefined"){
              	callback(data[name]);
            } else {
            	callback(undefined,new Error(name+" does not exist"));
            }
        })
    }
	save(name,data,callback){
    	getSaveFile(content=>{
        	if(!content[this.checkStr]) content[this.checkStr]={};
        	content[this.checkStr][name]=data;
        	writeJSON("save",content,callback);
        	saveData();
        })
    }
	remove(name,callback){
    	getSaveFile(content=>{
        	if(content[this.checkStr]&&content[this.checkStr][name]){
        		delete content[this.checkStr][name];
            }
        	writeJSON("save",content,callback);
        	saveData();
        })
    }
}

let library={
	yoinkgui:{GUIWindow, displayMessage, displayQuestion, displayPrompt},
	SaveManager,
	JSZip
};

function runCodeString(code,vThis){
	let func=new Function("library",code);
	if(!vThis) vThis={};
	return func.call(vThis,library);
};

function runLib(id,code){
	library[id]=runCodeString(code,{
    	ownSaveManager:new library.SaveManager(id,"library")
    });
};

function runBoot(id,code){
	runCodeString(code,{
    	ownSaveManager:new library.SaveManager(id,"boot")
    })
}

function runApp(code,vThis,data,packID){
	vThis.properties={id:packID,app:{id:data.name,icon:data.icon}};
	vThis.ownSaveManager=new library.SaveManager(packID,data.name);
	runCodeString(code,vThis);
};

function runAll(name,isLib){
	return new Promise(resolve=>{
    	console.group("Running scripts from "+name);
    	openJSON(name,content=>{
        	for(let i in content){
        		console.log(i);
        		try{
                	if(isLib){
        				runLib(i,content[i]);
                    } else {
                    	runBoot(i,content[i]);
                    }
            	} catch (e){
            		errors.push(e);
            		console.error(e);
            	}
        	};
        	console.groupEnd();
        	resolve();
        })
    })
};
function initAllPackageApps(content,packID){
	for(let i in content){
        let data=content[i];
        console.log(data.name);
        try{
            addAppToSession(data,function(){
            	runApp(data.code,this,data,packID);
            });
        } catch (e) {
            errors.push(e);
        	console.error(e);
    	}
    };
}
function initAllApps(){
	return new Promise(resolve=>{
    	console.group("Working on apps...");
    	openJSON("apps",content=>{
    		for(let i in content){
        		console.group(i);
        		initAllPackageApps(content[i],i)
        		console.groupEnd();
        	};
    		console.groupEnd();
        	resolve();
    	});
    })
};
function handleErrorNotifications(){
	if(errors.length==0) return;
	if(hasSystemBooted()){
    	for(let i in errors){
        	let err=errors[i];
        	$notif("Yoink Runtime Error","An error has occured. If this reoccurs, please report it throough Github Issues.<br>"+err);
        }
    } else {
    	setTimeout(handleErrorNotifications,100);
    }
}
onDataReady.push(async ()=>{
  	await runAll("lib",true);
	await runAll("boot",false);
	await initAllApps();
    handleErrorNotifications();
})