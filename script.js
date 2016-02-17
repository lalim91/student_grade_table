/**
 * Define all global variables here
 */
/**/
var student_array= [{name:"Harry", course:"Potions", grade:60},{name:"Ron", course:"Biology", grade:30},{name:"Hermione", course:"Writing", grade:98}];
//- global array to hold student objects
// /* @type {Array}
// */

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */

/**
 * addClicked - Event Handler when user clicks the add button
 */
function addClick() {
    addStudent();
    updateData();
    clearAddStudentForm();
    console.log('add button is clicked!');
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
   var student_object = {
       name:$('#studentName').val(),
       course:$('#course').val(),
       grade:$('#studentGrade').val()
   };
    student_object.operations = $('<button>').addClass('btn btn-danger').text('Delete');
    student_array.push(student_object);
    console.log(student_array);
    updateData();
    addStudentToDom(student_object);
}

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    console.log('cancel button is clicked!');
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
    updateData();
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(student_array){
    var sum = 0;
    for(var s= 0; s<student_array.length; s++){
        sum += student_array[s].grade;
    }
    $('#avgGrade').append(sum/student_array.length).toFixed(1);
}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){
    updateStudentList();
    //calculateAverage(student_array);
}
/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(){
    for(var i = 0; i < student_array.length; i++){
        //$('.student-list-container>.student_list>tbody').append(student_array[i]);
        addStudentToDom(student_array[i]);
    }
}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */


function addStudentToDom(studentObj){
    console.log('addStudentToDom triggered!');
    var studentRow = $('<tr>');
    var tableheader;
    //for each value inside object, append it to the th element
    for(i in studentObj){
        tableheader = $('<th>').append(studentObj[i]);
        studentRow.append(tableheader);
    }
    $('tbody').append(studentRow);
    console.log(studentRow);
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function resetApplication(){
    clearAddStudentForm();
    console.log('student array: ', student_array);
    $('tbody').empty();
    student_array = [];
}
function deleteStudent(){
    console.log("deleteStudent is triggered", this);
    $(this).closest("tr").remove();
}
/**
 * Listen for the document to load and reset the data to the initial state
 */

$(document).ready(function(){
    console.log('jquery is fine!');
    $('.btn-danger').on('click', deleteStudent);
    /*$('#cancelButton').on('click', cancelClick);*/
    /*$('.btn-default').on('click', function(){
        console.log('cancel button is clicked!');
        /!*$('#studentName').val('');*!/
    });*/
});

