let log;
let path;

return function(){
	if(!this.cli){
    	simpleAlert("Yoink must be ran through the terminal.");
    	return;
    };
	log=$log;
	path=this.cli.cfg.cwd;
	try{
		runFromArguments(this.arg.arguments,this.arg.options);
    } catch (e){
    	if(e.name=='Error'){
        	$log.error(e.message?e.message:(""+e));
        } else {
        	$log.error(e.stack?e.stack:(""+e));
        }
    }
};