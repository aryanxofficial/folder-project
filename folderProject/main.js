//this is an IIFE function

(function(){
    let btnAddFolder = document.querySelector("#myFirstButton");
    //template mei se koi cheex aise hi retrieve krte hai
    let divContainer = document.querySelector("#container");
    let pageTemplates = document.querySelector("#myTemplates");

    // to provide unique folder id to every folder template I create
    let fid=0;
    let folders=[];

    btnAddFolder.addEventListener("click", addFolder);

    function addFolder(){
        let fname = prompt("Folder name?"); 
        if(!fname){  //!fname se khali folder nahi bnega but if we press just spacebar tab bn jayega...
        //!!fname se sapcebar ke baad bhi khali naam wla folder nahi bnega
            return;
        }
        fid++;

        addFolderInPage(fname , fid);

        folders.push({
            id:fid , 
            name:fname
        });
        // console.log(folders);
        persistFolders();
    }

    function deleteFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let flag = confirm("Do you want to delete the folder " + divName.innerHTML);
        if(flag == true){
            divContainer.removeChild(divFolder);
            
            let idx = folders.findIndex(f => f.id == parseInt(divFolder.getAttribute("fid")));
            folders.splice(idx, 1);
            persistFolders();
        }
    }

    function editFolder(){
        let divFolder = this.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        let fname=prompt("ENTER THE NEW FOLDER NAME:");
        if(!fname){
            return;
        }
        // let divName = divFolder.querySelector("[purpose='name']"); //ek baar pehel nikal chuka hoo mai isse
        divName.innerHTML = fname;
        let folder=folders.find(f=> f.id==parseInt(divFolder.getAttribute("fid")));
        folder.name=fname;
        // console.log(folders);
        persistFolders();
    }

    function persistFolders(){
        console.log(folders);
        let fjson=JSON.stringify(folders);
        localStorage.setItem("data" , fjson);
    }

    function addFolderInPage(fname , fid){
        let divFolderTemplate = pageTemplates.content.querySelector(".folder");//template mei se koi cheez aise hi retrieve krte hai
        let divFolder = document.importNode(divFolderTemplate, true);//iss line se i m making a deep copy of the template
        //template mei se koi cheez aise hi retrieve krte hai
        // divFolderCopy.innerHTML=fname; //to write directly inside the div.
    
        divFolder.setAttribute("fid" ,fid);
        
        let divName = divFolder.querySelector("[purpose='name']");
        divName.innerHTML = fname;

        let spanDelete=divFolder.querySelector("span[action='delete']");
        //every time folder wla button click hota hai to ye function bnta hai for every folder
        //and iske closure mei wahi folder rehta hai...isliye jiss folder ka delete dabate hai 
        //vahi delete hota hai
        spanDelete.addEventListener("click", deleteFolder)
        
        let spanEdit=divFolder.querySelector("span[action='edit']");
        spanEdit.addEventListener("click", editFolder)

        divContainer.appendChild(divFolder); //isme i m appending the divs jo click krne pr create ho rahe hai
    }

    function loadFoldersFromStorage(){
        let fjson = localStorage.getItem("data");
        if(!!fjson){
            folders = JSON.parse(fjson);
            folders.forEach(function(f){
                addFolderInPage(f.name, f.id);
            })
        }
    }

    loadFoldersFromStorage();

})();
