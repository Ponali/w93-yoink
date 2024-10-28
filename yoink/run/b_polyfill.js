if(globalThis["$window"]){

  	// V2
  
	var question = function(message,callback){
		$alert({msg:message,btnOk:"Yes",btnCancel:"No"},callback);
		// find a way to change this from the gui to the terminal!!
	};

	var GUIWindow = class{
		constructor(options){
    		this.syswin = $window(options);
    		this.element = this.syswin.el.body;
    	}
	};

	var messageSettings = function(input){
		let settings={};
		if(typeof(input)=="string"){
    		settings.msg=input;
    	} else if(typeof(input)=="object"){
    		settings=input;
    	} else {
    		throw new Error("Unsupported type "+typeof(input));
    	};
		if(settings.message) settings.msg=settings.message;
		if(settings.icon){
    		settings.img=settings.icon;
    		delete settings.icon;
    	}
		return settings;
	};

	var displayMessage = function(input,callback){
		let settings=messageSettings(input);
		if(!settings.img) settings.img="/c/sys/skins/w93/info.png";
		if(!settings.sound) settings.sound=null;
		$alert(settings,callback);
	};

	var displayQuestion = function(input,callback){
		let settings=messageSettings(input);
		if(!settings.img) settings.img="/c/sys/skins/w93/question.png";
		if(!settings.sound) settings.sound=null;
		if(settings.yes) settings.btnOk=settings.yes;
		if(settings.no) settings.btnCancel=settings.no;
		if(!settings.btnOk) settings.btnOk="Yes";
		if(!settings.btnCancel) settings.btnCancel="No";
		$alert(settings,callback);
	};

	var displayPrompt = function(input,defaultAnswer,callback){
		let settings=messageSettings(input);
		if(!settings.sound) settings.sound=null;
		settings.prompt=defaultAnswer;
		settings.onclose = function(isOKPressed, data) {
    		var ret = data.prompt;
    		if(!isOKPressed) ret=false;
    		callback(ret);
    	};
		if(!settings.btnCancel) settings.btnCancel="Cancel";
		$alert(settings,callback);
	}

	var addAppToSession = function(data,run){
		if(!data.meta) data.meta={};
		le._apps[data.name]={
    		exec:run,
    		icon:data.icon,
    		name:data.meta.title,
    		terminal:data.meta.terminal,
    		categories:data.meta.categories
    	};
	};

	var removeAppFromSession = function(id){
		delete le._apps[id];
	}

	var hasSystemBooted = function(){
		return !document.querySelector("div#s42_splashscreen");
	};

	var fileExists = function(name){
		let res=$fs.utils.exist(name);
		if(res===false) return false;
		return true;
	}
  
  	var isFile = function(name){
    	return typeof($fs.utils.exist(name))=="number";
    }

	var openFile = function(filename,type,callback){
		$file.open(filename,type,callback)
	}

	var writeFile = function(filename,content,callback){
    	// look, i know this is very hacky, but i really need that fucking notification gone ok???
    	const ogNotif=$notif;
    	$notif=(()=>{});
		$file.save(filename,content,()=>{
        	callback();
        	$notif=ogNotif;
        });
	}

	var simpleAlert = function(text){
		$alert(text);
	}

}