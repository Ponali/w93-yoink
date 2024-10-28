function blobToDataURL(blob, callback) {
    var a = new FileReader();
    a.onload = function(e) {callback(e.target.result);}
    a.readAsDataURL(blob);
};
function blobToDataURLAsync(blob){
	return new Promise(resolve=>{
    	blobToDataURL(blob,resolve);
    })
}
class PackageFile{
	async readPNG(name){
    	let u8=await this.zip.file(name).async("uint8array")
    	let blob=new Blob([new Uint8Array(u8)], { type: "image/png" });
    	return await blobToDataURLAsync(blob);
    }
	async readApp(app){
    	let zip=this.zip;
    	let cont={};
    	if(zip.file(app+"icon")) cont.icon=await this.readPNG(app+"icon");
    	if(zip.file(app+"meta")) cont.meta=JSON.parse(await zip.file(app+"meta").async("string"))
        cont.code=await zip.file(app+"code").async("string");
    	cont.name=app.slice(0,-1);
    	this.content.apps.push(cont);
    	return;
    }
	async init(blob){
    	let zip = await JSZip.loadAsync(blob)
        this.zip=zip;
      
        let metafile = await zip.file("meta").async("string")
        this.meta=JSON.parse(metafile);
      
      	let dependfile = await zip.file("depend").async("string");
    	this.depend = dependfile.split(" ").filter(a=>a);
      
      	this.content={apps:[]};
      	if(zip.file("lib")) this.content.lib=await zip.file("lib").async("string");
      	if(zip.file("boot")) this.content.boot=await zip.file("boot").async("string");
      	
      	let apps=Object.entries(zip.files).map(a=>a[1]).filter(a=>a.dir).map(a=>a.name);
      	for(let i in apps){
        	let appname=apps[i];
          	await this.readApp(appname);
        };
    }
}