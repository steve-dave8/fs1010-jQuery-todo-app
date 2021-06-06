//Global variables
let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let taskList = [
    {task: "Example 1", dueDate: "June 20, 2021", completed: false, ID: 1},
    {task: "Example 2", dueDate: "July 30, 2021", completed: false, ID: 2},
    {task: "Example 3", dueDate: "July 2, 2021", completed: true, ID: 3},
    {task: "Example 4", dueDate: "July 15, 2021", completed: false, ID: 4},
  ];
  let id = 4;
//-----------------------------

//Utility functions:
const renderTask = (taskValue, date, id) => {
  let taskItem = `<li><p><span class="bold">Task: </span>${taskValue}</p>
      <p><span class="bold">Due date: </span>${date}</p>
      <span class="hidden">${id}</span>
      <label>Completed: <input type="checkbox"></label></li>`;
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
  $("input#newTask").focus();

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

  renderList(); //displays task list

  //While in task input field, prevent pressing Enter key from submitting the form and refreshing the page:
  $("input#newTask").keydown(function (event){
    if (event.which == 13) {
      event.preventDefault();
    };      
  });
  //----------------------------- 

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
    $("aside > button").removeClass("activeSort");
    id++;
    let dueDate = $("input#dueDate").val();
    let reformattedDate = reformatDate(dueDate);
    let task = new Task(taskValue, reformattedDate, id);
    taskList.push(task);     
    let taskDisplay = renderTask(taskValue, reformattedDate, id);
    $("ul").prepend(taskDisplay);
  });

  //Change style of task list item based on status from checkbox input:
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
  });
  //-----------------------------

  //Sort task items by due date:
  $("button#sortDate").on("click", function (){
    $("aside > button").removeClass("activeSort");
    $(this).addClass("activeSort");
    $("ul").empty();
    taskList.sort((a, b) => Date.parse(a.dueDate) - Date.parse(b.dueDate));
    renderList();
  });
  //-----------------------------

  //Sort task items by first added:
  $("button#sortByFirst").on("click", function (){
    $("aside > button").removeClass("activeSort");
    $(this).addClass("activeSort");
    $("ul").empty();
    taskList.sort((a, b) => a.ID - b.ID);
    renderList();
  });
  //-----------------------------
  
  //Sort task items by last added:
  $("button#sortByLast").on("click", function (){
    $("aside > button").removeClass("activeSort");
    $(this).addClass("activeSort");
    $("ul").empty();
    taskList.sort((a, b) => b.ID - a.ID);
    renderList();
  });
  //-----------------------------
});