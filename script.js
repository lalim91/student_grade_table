/**
 * Define all global variables here
 */
/**/
//var student_array= [{name:"Harry", course:"Potions", grade:60},{name:"Ron", course:"Biology", grade:30},{name:"Hermione", course:"Writing", grade:98}];
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
       },

   };
    student_array.push(student_object);
    console.log(student_array);
    highlight_student();
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#studentName').val("");
    $('#course').val("");
    $('#studentGrade').val("");
}
/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(student_array){
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
    updateStudentList();
    calculateAverage(student_array);
}
/**ß
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(){
    $('.student-list-container>.student-list>tbody>tr').remove();
    for (var i = 0; i<student_array.length; i++){
        addStudentToDom(student_array[i]);
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
/*function deleteStudent(){
    console.log("deleteStudent is triggered", this);
    $(this).closest("tr").remove();
}*/
/**
 * Listen for the document to load and reset the data to the initial state
 */

$(document).ready(function(){
    console.log('jquery is fine!');
    /*$('.btn-danger').on('click', function(){
        $(this).closest("tr").remove();
    });*/
    /*$('#cancelButton').on('click', cancelClick);*/
    /*$('.btn-default').on('click', function(){
        console.log('cancel button is clicked!');
        /!*$('#studentName').val('');*!/
    });*/
});

/*Function highlight_student()
this function will highlight the student with the highest grade in green, and the student with the lowest grade in red
 */
function highlight_student(){

}
