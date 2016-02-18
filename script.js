/**
 * Define all global variables here
 */
/**/
var courseInput = "stfu"; //initialized for now.

//var student_array= [{name:"Harry", course:"Potions", grade:60},{name:"Ron", course:"Biology", grade:30},{name:"Hermione", course:"Writing", grade:98}];
var highest;
var lowest;
var student_array = [];
var courseList = {
    'mathematics': null,
    'material science': null,
    'art science': null,
}
/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClick() {
    addStudent();
    clearAddStudentForm();
    updateData();
    console.log('add button is clicked!');
    var empty_message = $('.empty');
        empty_message.remove();
}

/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClick() {
    clearAddStudentForm();
}
/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
    var arrayIndex= student_array.length;
    var student_object = {
       name:$('#studentName').val(),
       course:$('#course').val(),
       grade:$('#studentGrade').val(),
       DOMposition:null,
       arrayIndex: arrayIndex,
       self_delete: function(){
           this.DOMposition.remove();
           student_array.splice(this.arrayIndex,1);
           changeIndex(this.arrayIndex);
           console.log('new highest fired');
           console.log('new lowest fired');
           new_lowest();
           new_highest();

       },

   };
    student_array.push(student_object);
    console.log(student_array);

}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}



function changeIndex(index){

    for(index; index < student_array.length; index++){
        student_array[index].arrayIndex -= 1;
    }
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(){
    if (student_array.length == 0){
        $('.avgGrade').text('0');
        return;
    }
    var sum = 0;
    for(var s= 0; s<student_array.length; s++){
        sum += parseInt(student_array[s].grade);
    }

    $('.avgGrade').text((sum/student_array.length).toFixed(0));
    console.log((sum/student_array.length).toFixed(0));
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){
    calculateAverage();
    if(student_array.length != 0){
        addStudentToDom(student_array[student_array.length-1]);
    }

}
/**ß
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(){
    $('.student-list-container>.student-list>tbody>tr').remove();
    var empty_student_display = $('<td>',{
        class:'empty',
        colspan:2
    });
    var empty_display = $('<h4>',{
        text:"User Info Unavailable",
    });
    if (student_array.length == 0){
        $('.student-list tbody').append(empty_student_display);
        empty_student_display.append(empty_display);
    }else{
        for (var i = 0; i<student_array.length; i++){
            addStudentToDom(student_array[i]);
        }
    }

    //addStudentToDom(student_array[student_array.length-1]);
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */


function addStudentToDom(studentObj){
    var studentRow = $('<tr>');
    var studentName = $('<td>', {
        text: studentObj.name
    });
    var studentCourse = $('<td>',{
        text:studentObj.course
    });
    var studentGrade = $('<td>',{
        text:studentObj.grade
    });
    var deleteButton = $('<button>',{
        class:"btn btn-danger",
        text:"Delete"
    });
    deleteButton.on('click',function(){
        //studentObj.element.remove();
        studentObj.self_delete();
        console.log('my element is ',studentObj);
    });
    $('tbody').append(studentRow);
    studentRow.append(studentName, studentCourse, studentGrade, deleteButton);
    studentObj.DOMposition = studentRow;
    console.log('highest fired');
    console.log('lowest fired');
    find_lowest();
    find_highest();

}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function resetApplication(){
    student_array = [];
    updateStudentList();
    updateData();
}
function autoComplete(){ console.log("autocomplete() is invoked!");
    var courseListKeys = Object.keys(courseList); //stores courseList keys into array of strings
    console.log('the list of courses ', courseListKeys);
    //console.log('testing the substring: ', courseListKeys[0].substring(0, courseInput.length));
    console.log('user input in course ', courseInput);

    for(var i in courseListKeys){
        //$('#courseDropDown').empty();
        if(courseListKeys[i].substring(0, courseInput.length) == courseInput){
            //if all characters are equal thus far...
            var lists = $('<li>',{
                class:"dropDownShow",
                text:courseListKeys[i]
            });
            ////append the text of courseListKeys to the <li>

            $('#courseDropDown').append(lists).css('display', 'block');
            //////append the <li> to #courseDropDown
        }
    }//END for(var i in courseListKeys)
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    resetApplication();
    console.log('jquery is fine!');
    $('#course').on('keyup', function(){
        courseInput = $(this).val().toLowerCase(); //toLowerCase for case-insensitivity
        autoComplete(); //invoke autoComplete function
        //console.log(courseInput);//consolelog everytime a key is pressed
    });
});

function find_highest(){
    console.log('highest recieved');
        if(student_array.length == 1){
            highest = student_array[0]
        }else {
            if(Number(highest.grade) < Number(student_array[student_array.length-1].grade)){
                unhighlight(highest);
                highest = student_array[student_array.length-1];
            }
        }
    highlight_highest();
    if (student_array.length == 2){ //this part of the function fixes a highlight bug, since the first entry is both highest and lowest
        highlight_lowest();
    }
}

function find_lowest(){
    console.log('lowest recieved');
        if(student_array.length == 1){
            lowest = student_array[0]
        }else {
            if(Number(lowest.grade) > Number(student_array[student_array.length-1].grade)){
                unhighlight(lowest);
                lowest = student_array[student_array.length-1];
            }
        }
    highlight_lowest();
}

function unhighlight(highlighted){
    highlighted.DOMposition.css('background-color','inherit');
}

function highlight_highest(){
    highest.DOMposition.css('background-color','green');
}
function highlight_lowest(){
    lowest.DOMposition.css('background-color','red');
}

function new_highest(){
    console.log('new highest recieved');
    highest = student_array[0];
    for (var i = 1; i < student_array.length; i++) {
        if (Number(student_array[i].grade) > Number(highest.grade)) {
            highest = student_array[i];
        }
    }
    highlight_highest();
}

function new_lowest(){
    console.log('new lowest recieved');
    lowest = student_array[0];
    for (var i = 1; i < student_array.length; i++) {
        if (Number(student_array[i].grade) < Number(lowest.grade)) {
            lowest = student_array[i];
        }
    }
    highlight_lowest();
}