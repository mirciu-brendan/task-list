// DOM selectors
const tasksGroupTable = document.getElementById("tasksGroupTable");
const tasksTable = document.getElementById("tasksTable");
const addNewGroup = document.getElementById("newGroupButton");
const backButton = document.getElementById("backButton");
const main2 = document.getElementById("main2");
const groupInput = document.querySelector('[group-name]');
const taskNameInput = document.querySelector('[task-input]');
const userIdInput = document.querySelector('[user-input]');
const deadlineInput = document.querySelector('[deadline-input]');
const statusInput = document.querySelector('[status-input]');
const newForm = document.querySelector('[data-new-task-form]');
const groupTitleElement = document.querySelector('[data-group-title]');


// started settings
const LOCAL_STORAGE_LIST_KEY = 'group.list';
const LOCAL_STORAGE_USER_KEY_GET = 'user.list';
let allTasksGroups = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let users = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USER_KEY_GET));
let selectedGroupId = null;
let selectedTaskName = null;
let cord = null;

// sorting group by name and number of tasks
$('[group-table-header]').on('click', function() {
    var column = $(this).data('column')
    var order = $(this).data('order')
    var text = $(this).html()
    text = text.substring(0, text.length -1)
    
    if(column == "groupName"){
    if(order == 'desc'){
        $(this).data('order', "asc")
        allTasksGroups = allTasksGroups.sort((a,b) => a.tasksGroup[column] > b.tasksGroup[column] ? 1 : -1);
        text += "&#9650"
    }else{
        $(this).data('order', "desc")
        allTasksGroups = allTasksGroups.sort((a,b) => a.tasksGroup[column] < b.tasksGroup[column] ? 1 : -1)
        text += "&#9660"
    }}
    if(column == "tasksInGroup"){
        if(order == 'desc'){
            $(this).data('order', "asc")
            allTasksGroups = allTasksGroups.sort((a,b) => a.tasksGroup[column].length > b.tasksGroup[column].length ? 1 : -1)
            text += "&#9650"
        }else{
            $(this).data('order', "desc")
            allTasksGroups = allTasksGroups.sort((a,b) => a.tasksGroup[column].length < b.tasksGroup[column].length ? 1 : -1)
            text += "&#9660"
        }}
    $(this).html(text);
    render();
});


//Adding ne group event -> display a table with form (screen 2)
addNewGroup.addEventListener('click', e => {
    selectedGroupId = null;
    selectedTaskName = null;
    cord = null;
    currentGroupName = null;
    groupInput.value= null;
    groupTitleElement.innerText = "New tasks group"
    renderTasks(currentGroupName);
    main2.classList.add("active");
    renderUsers()
});
// back to sreen 1
backButton.addEventListener("click", e => {
    saveAndRender()
    main2.classList.remove("active");
    currentGroupName = null;
    selectedGroupId = null;
    selectedTaskName = null;
})

//  Events from a group table (edit and delete)
tasksGroupTable.addEventListener('click', e => {
    // edit group
    if (e.target.parentNode.tagName.toLowerCase() == "tr"){
        selectedGroupId = e.target.parentNode.id;
        selectedGroup = allTasksGroups.find(group => group.id == selectedGroupId);
        
        groupTitleElement.innerText = selectedGroup.tasksGroup.groupName;
        groupInput.value=selectedGroup.tasksGroup.groupName;
        currentGroupName = selectedGroup.tasksGroup.groupName;
        renderTasks(currentGroupName);
        renderUsers()
        main2.classList.add("active");
        
       
    }
    /// delete group a from the table
    if (e.target.tagName.toLowerCase() == "span"){
        allTasksGroups = allTasksGroups.filter(group => group.id !== e.target.id);
        saveAndRender();
        
    }

})

// Events from a task table
tasksTable.addEventListener('click', e => {
    // edit task
    if (e.target.parentNode.tagName.toLowerCase() == "tr"){
        selectedTaskName = e.target.parentNode.id;
        let cord = findTaskInList(selectedTaskName, currentGroupName);
        let i = parseInt(cord[0]);
        let j = parseInt(cord[1]);
        
        taskNameInput.value = allTasksGroups[i].tasksGroup.tasksInGroup[j].name;
        deadlineInput.value = allTasksGroups[i].tasksGroup.tasksInGroup[j].deadline;
        userIdInput.value = allTasksGroups[i].tasksGroup.tasksInGroup[j].userId;
        statusInput.value = allTasksGroups[i].tasksGroup.tasksInGroup[j].status;
                       
    }
    /// delete task from the selected group
    if (e.target.tagName.toLowerCase() == "span"){

        cord = findTaskInList(e.target.id,currentGroupName);
        
        let i = parseInt(cord[0]);
        let j = parseInt(cord[1]);
        allTasksGroups[i].tasksGroup.tasksInGroup.splice(j,1)
        saveAndRender();
        renderTasks(currentGroupName);
        selectedTaskName = null;
    }    

})
// class for task Group
class TaskGroup {
    constructor(groupName){
        this.groupName = groupName;
        this.tasksInGroup = [];
    }
}
// class for task, which will push to an array "tasksInGroup" in TaskGroup
class Task {
    constructor(name, deadline, userId, status){
        this.name = name;
        this.deadline = deadline;
        this.userId = userId;
        this.status = status;
    }

}

function createTask( name, deadline, userId, status){
    return new Task(name, deadline, userId, status);
}

function changeGroupName(currentGroupName, newGroupName){
    for(var i in allTasksGroups){
        if (allTasksGroups[i].tasksGroup.groupName == currentGroupName){
        allTasksGroups[i].tasksGroup.groupName = newGroupName;
        break;
    };
    };
};

function findTasksList(currentGroupName){
    var tasksInGroup = [];
    for(var i in allTasksGroups){
        if (allTasksGroups[i].tasksGroup.groupName == currentGroupName){
        tasksInGroup = allTasksGroups[i].tasksGroup.tasksInGroup;
        return tasksInGroup;
    };
    };
};

function findTaskInList(currentTaskName, currentGroupName){
    var cord = null;
    for(let i in allTasksGroups){
        if (allTasksGroups[i].tasksGroup.groupName == currentGroupName){
        for( let j in allTasksGroups[i].tasksGroup.tasksInGroup){
            if (allTasksGroups[i].tasksGroup.tasksInGroup[j].name === currentTaskName){
            cord = [i,j]
            return cord;
            }
        };
        
        };
    };
    return cord;
};

function pushTaskToGroup(task, currentGroupName){
    for(var i in allTasksGroups){
        if (allTasksGroups[i].tasksGroup.groupName == currentGroupName){
       
        allTasksGroups[i].tasksGroup.tasksInGroup.push(task);
        
        break;
    };
    };
};
// Form submmited by button "save" (adding, editing group name and adding, editing task in selected group)
newForm.addEventListener('submit', e => {
    e.preventDefault()
    //change group name
    if(selectedGroupId !== null){
        let newGroupName = groupInput.value;
        if (newGroupName == null || newGroupName === "") {window.alert("Group name is empty!"); return}
        
        selectedGroup = allTasksGroups.find(group => group.id == selectedGroupId);
        currentGroupName = selectedGroup.tasksGroup.groupName;
        if (newGroupName !== currentGroupName){
            changeGroupName(currentGroupName, newGroupName);
            // selectedGroupName = ;
            currentGroupName = newGroupName;
            saveAndRender();
            groupTitleElement.innerText = currentGroupName;
            renderTasks(currentGroupName);
        }
    };
    // add new group
    if(selectedGroupId == null){
        const newGroupName = groupInput.value;
        if (newGroupName == null || newGroupName === "") {window.alert("Group name is empty!"); return}
        let existingGroup = allTasksGroups.find(group => group.tasksGroup.groupName == newGroupName);
        if (existingGroup) {
            window.alert("This group already exists!");
            groupInput.value = null; 
            return;
        }
        const group = createGroup(newGroupName);
        allTasksGroups.push(group);
        let x = allTasksGroups.find(group => newGroupName == group.tasksGroup.groupName);
        selectedGroupId = x.id;
        saveAndRender();
        selectedGroup = allTasksGroups.find(group => group.id == selectedGroupId);
        groupTitleElement.innerText = selectedGroup.tasksGroup.groupName;
        currentGroupName = selectedGroup.tasksGroup.groupName;
        

    };
    // adding and editing task
    if(taskNameInput.value !== "" || userIdInput.value !== "" || deadlineInput.value !== "" || statusInput.value !== ""){
        if (taskNameInput.value == "" || userIdInput.value == "" || deadlineInput.value == "" || statusInput.value == ""){window.alert("You must complete all fields!"); return}
        
        if(taskNameInput.value !== "" && userIdInput.value !== "" && deadlineInput.value !== "" && statusInput.value !== ""){
            //add task
            if(selectedTaskName == null){
            let newTaskName = taskNameInput.value
            //checking if taks with this name exists
            cord = findTaskInList(newTaskName, currentGroupName)
            
            if(cord !== null) {window.alert("A taks with this name already exists!"); return}
            let newUserId = userIdInput.value
            let newDeadline = deadlineInput.value
            let newStatus = statusInput.value

            const task = createTask(newTaskName,newDeadline,newUserId,newStatus);
            pushTaskToGroup(task, currentGroupName);
            saveAndRender();
            taskNameInput.value=null;
            userIdInput.value="";
            deadlineInput.value=null;
            statusInput.value="";
            renderTasks(currentGroupName);
            }
            //edit selected task
            if(selectedTaskName !== null){

                let newTaskName = taskNameInput.value       
                let newUserId = userIdInput.value
                let newDeadline = deadlineInput.value
                let newStatus = statusInput.value
                cord = findTaskInList(selectedTaskName, currentGroupName)
                
                let i = parseInt(cord[0]);
                let j = parseInt(cord[1]);
                
                allTasksGroups[i].tasksGroup.tasksInGroup[j].name = newTaskName
                allTasksGroups[i].tasksGroup.tasksInGroup[j].deadline = newDeadline;
                allTasksGroups[i].tasksGroup.tasksInGroup[j].userId = newUserId;
                allTasksGroups[i].tasksGroup.tasksInGroup[j].status = newStatus;
            
                saveAndRender();
                taskNameInput.value=null;
                userIdInput.value="";
                deadlineInput.value=null;
                statusInput.value="";
                renderTasks(currentGroupName);
                selectedTaskName = null;
                }
        }
    }
});

function createGroup(name){
    return { id: Date.now().toString(), tasksGroup: new TaskGroup(name)}
}
function save(){
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(allTasksGroups));
}

function saveAndRender(){
    save();
    render();
}

function renderUsers(){
    clearElement(userIdInput);
    let optionDefault = `<option value="" selected disabled hidden>Choose user</option>`;
    userIdInput.innerHTML += optionDefault;
    users.forEach(e => {
        let option = `<option value="${e.id}">${e.firstName} ${e.lastName}</option>`
        userIdInput.innerHTML += option;
    });                
};

function render(){
    clearElement(tasksGroupTable);
    allTasksGroups.forEach(element => {

        let row = `<tr id="${element.id}" class="table-rows" >
                    <td>${element.tasksGroup.groupName}</td>
                    <td class="number">${element.tasksGroup.tasksInGroup.length}</td>
                    <td class="action">
                        <span id="${element.id}" class="material-icons delete-grp" data-delete-group>delete</span>
                    </td>
                </tr>`
        tasksGroupTable.innerHTML += row;
    })
}

function renderTasks(currentGroupName){
    clearElement(tasksTable);
    if (currentGroupName == null) return;
    tasksList = findTasksList(currentGroupName);
    tasksList.forEach(e => {
        let user = users.find(element => element.id == e.userId);
        let row = `<tr id="${e.name}" class="table-rows">
                        <td>${e.name}</td>
                        <td class="number">${e.deadline}</td>
                        <td class="number">${user.firstName + " " + user.lastName}</td>
                        <td class="action">${e.status}</td>
                        <td class="action">                       
                            <span id="${e.name}" class="material-icons delete">delete</span>
                        </td>
                  </tr>`;
        tasksTable.innerHTML += row;
    });
    
}



function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();
