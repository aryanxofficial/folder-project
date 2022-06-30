(function(){
    let btnAddFolder = document.querySelector("#myFirstButton");
    let divContainer = document.querySelector("#container");
    let pageTemplates = document.querySelector("#myTemplates");
    let divBreadCrumb=document.querySelector("#divBreadCrumb");
    let aRootPath=document.querySelector(".path");
    let folders=[];
    let fid=-1;
    let cfid=-1; //id of the folder in which we are currently

    btnAddFolder.addEventListener("click" , addFolder);
    aRootPath.addEventListener("click" , navigateBreadCrumb);

    function addFolder(){
      let fname=prompt("ENTER THE NAME OF FOLDER.");
      if(!!fname & fname!=" "){
            let fidx=folders.findIndex(f => f.name==fname);
            if(fidx==-1){
                fid++;
                folders.push({
                    id :fid , 
                    name:fname,
                    pid:cfid
                });
                addFolderHTML(fname , fid , cfid);
                saveToLocalStorage();
            }
            else{
                alert(fname+" FOLDER ALREADY EXISTS");
            }
        }
        else{
            prompt("ENTER SOMETHING");
        }
    }

    function editFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let ofname=divName.innerHTML;

        let nfname=prompt("ENTER THE NEW FOLDER NAME FOR "+ofname);
        if(!!nfname){
            if(nfname != ofname){
               let exists=folders.filter(f => f.pid==cfid).some(f => f.name==nfname);
               if(exists ==false){
                   //ram
                   let folder=folders.find(f => f.name ==ofname);
                   folder.name=nfname;

                   //html
                   divName.innerHTML=nfname;

                   //storage
                   saveToLocalStorage();
                }
                else{
                    alert(nfname + " ALREADY EXISTS");
                }
            }
            else{
                alert("THIS IS THE OLD NAME ONLY. PLEASE ENTER A NEW NAME.");
            }
        }
        else{
            alert("PLEASE ENTER A NAME");
        }
        // console.log(folders);
        // saveToLocalStorage();
    }
 
    function deleteFolder(){
        let divFolder=this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");
        let fidtbd=divFolder.getAttribute("fid"); //folder id to be deleted


        let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
        if(flag == true){
            let exists=folders.findIndex(f => f.pid==fidtbd);
            if(exists == false){

                //ram
                let idx = folders.filter(f => f.pid==cfid).findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
                folders.splice(idx, 1);

                //html
                divContainer.removeChild(divFolder);

                //storage
                saveToLocalStorage();
            }
            else{
                alert("CAN'T DELETE , HAS CHILDREN");
            }
            
        }
    }
    function viewFolder(){
        let divFolder=this.parentNode;
        let divName=divFolder.querySelector("[purpose='name']");
        cfid=parseInt(divFolder.getAttribute("fid"));

        let aPathTemplate=pageTemplates.content.querySelector(".path");
        let aPath=document.importNode(aPathTemplate , true);

        aPath.innerHTML=divName.innerHTML;
        aPath.setAttribute("fid" , cfid);
        aPath.addEventListener("click" , navigateBreadCrumb);
        divBreadCrumb.appendChild(aPath);

        divContainer.innerHTML="";
        folders.filter(f =>f.pid ==cfid).forEach(f => {
            addFolderHTML(f.name , fid , pid);
        })
    }
    function saveToLocalStorage(){
        let fjson=JSON.stringify(folders);
        localStorage.setItem("data" , fjson);
    }
    function retrieveFromLocalStorage(){
        let fjson=localStorage.getItem("data");
        if(!!fjson){
            let folders=JSON.parse(fjson);
            folders.forEach(f =>{
                if(f.id > fid){
                    fid=f.id;
                }

                if(f.pid==cfid){
                   addFolderHTML(f.name , f.id);
                }
            });

        } 
    }
    function addFolderHTML(fname , fid , pid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);
    
        divFolder.setAttribute("fid" ,fid);
        divFolder.setAttribute("pid" , pid);
        
        let divName = divFolder.querySelector("[purpose='name']");
        divName.innerHTML = fname;

        let spanDelete=divFolder.querySelector("span[action='delete']");
        spanDelete.addEventListener("click", deleteFolder)
        
        let spanEdit=divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click", editFolder)

        let spanView=divFolder.querySelector("span[action='view']");
        spanView.addEventListener("click", viewFolder);

        divContainer.appendChild(divFolder); 
    }
    function navigateBreadCrumb(){
        let fname=this.innerHTML;
        cfid=parseInt(this.getAttribute("fid"));

        divContainer.innerHTML="";
        folders.filter(f => f.pid==cfid).forEach(f =>{
            addFolderHTML(f.name , f.id , f.pid);
        });

        while(this.nextSibling){
            this.parentNode.removeChild(this.nextSibling);
        }
    }

    retrieveFromLocalStorage();

})();