//Global variables
let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; 
let taskList = [
    {task: "Example 1", dueDate: "June 20, 2021", completed: false, ID: 1},
    {task: "Example 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae semper dolor. Sed venenatis ligula ac odio lacinia blandit. Nullam imperdiet ex sed ultrices aliquet. Morbi vel turpis lobortis, faucibus nibh non, malesuada nibh.", dueDate: "July 30, 2021", completed: false, ID: 2},
    {task: "Example 3", dueDate: "July 2, 2021", completed: true, ID: 3},
    {task: "Example 4. UI fire up your browser we need to build it so that it scales it's not hard guys. This proposal is a win-win situation which will cause a stellar paradigm shift, and produce a multi-fold increase in deliverables pulling teeth, yet re-inventing the wheel.", dueDate: "July 15, 2021", completed: false, ID: 4},
  ];
  /*The tasks in this array are just for demonstration purposes. 
  Node could be used to save this data in a json file.*/
let id = taskList.reduce((max, task) => task.ID > max ? task.ID : max, taskList[0].ID); //id starts at the highest ID number from the taskList array.
//-----------------------------

//Utility functions:
const renderTask = (taskValue, date, id) => {
  let taskItem = `<li><p><span class="bold">Task: </span>${taskValue}</p>
      <p><span class="bold">Due date: </span>${date}</p>
      <span class="hidden">${id}</span>
      <label>Completed: <input type="checkbox"></label>
      <button type="button" class="deleteBtn">Delete Task</button></li>`;
  return taskItem;
};

const renderList = () => {
  taskList.forEach(taskItem => {
      let taskValue = taskItem.task;
      let dueDate = taskItem.dueDate;
      let id = taskItem.ID;
      let taskDisplay = renderTask(taskValue, dueDate, id);
      $("ul").append(taskDisplay).find("li:last-child").addClass(function (){
        if (taskItem.completed === true) {
          $(this).children("label").children("input").prop("checked", true);
          let addedClass = "text-muted";
          return addedClass;
        }
      });
    });
};

//Function to reformat the standard date string format of YYYY-MM-DD :
const reformatDate = (date) => {
  let [yyyy, mm, dd] = date.split("-");
  if (mm.charAt(0) == 0) {
    mm = mm.slice(1);
  }
  if (dd.charAt(0) == 0) {
    dd = dd.slice(1);
  }
  mm = monthList[mm-1];
  let revdate = `${mm} ${dd}, ${yyyy}`;
  return revdate;
};

//Move completed tasks to end of taskList array if the aside checkbox is checked:
const moveCompletedToBottom = () => {
    if ($("input#moveToBottom").prop("checked")) {
        let completedList = taskList.filter(task => task.completed === true);
        let toDoList = taskList.filter(task => task.completed === false);
        taskList = toDoList.concat(completedList);
    }
};

const sortList = (selector) => {
  $("aside > button").removeClass("activeSort");
  $(selector).addClass("activeSort");
  $("ul").empty();
  switch (selector) {
    case "button#sortDate":
      taskList.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
      break;
    case "button#sortByFirst":
      taskList.sort((a, b) => a.ID - b.ID);
      break;
    case "button#sortByLast":
      taskList.sort((a, b) => b.ID - a.ID);
      break;
  }
  moveCompletedToBottom();
  renderList();
}

//Constructor for task object:
class Task {
  constructor(task, dueDate, id) {
    this.task = task;
    this.dueDate = dueDate;
    this.completed = false;
    this.ID = id;       
  }
};
//end of utility functions----------------------------------------------------------

$(document).ready(function() {
  $("input#newTask").focus(); //when page loads focus on the input field

  //Set date input placeholder:
  let today = new Date();
  let month = today.getMonth()+1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = today.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let todaysDate = `${today.getFullYear()}-${month}-${day}`;
  $("input#dueDate").attr("value", todaysDate);
  //-----------------------------

  renderList(); //display tasks saved in the taskList array

  //While in task input field, prevent pressing Enter key from submitting the form and refreshing the page:
  $("input#newTask").keydown(function (event){
    if (event.which == 13) {
      event.preventDefault();
    };      
  });
  //----------------------------- 

  //Take form input, display it in the list, and add the data to taskList array:
  $("button#logTask").click(function (){
    let taskValue = $("input#newTask").val();
    $("input#newTask").removeClass("alert");
    $("input#newTask~span").removeClass("alertInfo");
    //If task field is empty then display alert and stop the function:
    if (taskValue.trim() == "") {
      $("input#newTask").addClass("alert");
      $("input#newTask~span").addClass("alertInfo");
      return;
    }
    $("button#sortDate").removeClass("activeSort");
    $("button#sortByFirst").removeClass("activeSort");
    id++;
    let dueDate = $("input#dueDate").val();
    let reformattedDate = reformatDate(dueDate);
    let task = new Task(taskValue, reformattedDate, id);
    taskList.unshift(task);     
    let taskDisplay = renderTask(taskValue, reformattedDate, id);
    $("ul").prepend(taskDisplay);
  });
  //-----------------------------

  //Change style of task list item based on status from checkbox input. 
  $("ul").on("click", "li input", function (){
    let taskID = $(this).parent().siblings("span.hidden").text();
    let selectedTask = taskList.find(taskItem => taskItem.ID == taskID);
    if ($(this).prop("checked")) {
      $(this).parents("li").addClass("text-muted");         
      selectedTask.completed = true;
    } else {
      $(this).parents("li").removeClass("text-muted");         
      selectedTask.completed = false;
    }
    //Move the task to the bottom of the list if both this and the aside checkboxes are checked.
    if ($(this).prop("checked") && $("input#moveToBottom").prop("checked")) {
        $(this).parents("li").detach().appendTo("ul");
    }
  });
  //-----------------------------

  //Delete task item from list and array:
  $("ul").on("click", "li > button", function (){
      let confirmation = confirm("Are you sure you want to delete this task item?");
      if (confirmation) {
        let taskID = $(this).siblings("span.hidden").text();
        let index = taskList.findIndex(taskItem => taskItem.ID == taskID);
        taskList.splice(index, 1);
        $(this).parent().remove();
      }
  });
  //-----------------------------

  //Sort task items by due date:
  $("button#sortDate").on("click", function (){
    sortList("button#sortDate");
  });

  //Sort task items by first added:
  $("button#sortByFirst").on("click", function (){
    sortList("button#sortByFirst");
  });
  
  //Sort task items by last added:
  $("button#sortByLast").on("click", function (){
    sortList("button#sortByLast");
  });

  //If the aside checkbox is checked, then sort by completed tasks:
  $("input#moveToBottom").click(function (){
      moveCompletedToBottom();
      if ($("input#moveToBottom").prop("checked")) {
        $("ul").empty();
        renderList();
      }
  });
});