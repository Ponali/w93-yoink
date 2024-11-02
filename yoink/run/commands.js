const help=[
	"Yoink is a package manager made for Windows 93 that helps downloading and installing software in a linux-esque manner, making for any program to be only in one place on the disk.",
	"If you would like to help the project grow, this is open-source on GitHub: https://github.com/Ponali/w93-yoink/",
	"",
	"Usage: yoink [-i, -r [-o, -a], -m] [packagenames]",
	"-i: Install packages. If a package already exists, it will be reinstalled.",
	"-r: Remove packages",
	"  -o: Will remove orphaned packages afterwards.",
	"  -a: Will remove additional data prior to scripts.",
	"-m: Update mirror list.",
	"-s: Update source code (only works with source versions)",
	"-h: Shows this help menu."
];

function getAction(flags,arglen){
	let entries=Object.entries(flags);
	let flaglist=["i","r","m","h","s","install","remove","update_mirrors","help","update_source"];
	entries=entries.filter(a=>flaglist.includes(a[0]));
	if(entries.length>1){
    	throw new Error("-i, -r, and -m cannot be merged.");
    };
  
  	let defaultAct=-1;
	if(arglen>=1) defaultAct=0;
  
	if(entries.length<1) return defaultAct;
	switch(entries[0][0]){
        case "h": case "help": return -1;break;
      	case "i": case "install": return 0;break;
        case "r": case "remove": return 1;break;
        case "m": case "update_mirrors": return 2;break;
    	case "s": case "update_source": return 3;break;
    };
	$log("welcome to no man's land, take this:");
	return -1;
}

function runFromArguments(args, flags){
	if(!flags) flags={};
	let action=getAction(flags,args.length);
	switch(action){
        case -1:$log(help.join("\n"));break;
      	case 0:installPackages(args);break;// install
      	case 1:removePackageCmd(args,flags);break;// remove
      	case 2:updateMirrors();break;// update mirrors
      	case 3:reloadFunc();break;
    }
}
