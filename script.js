/**
 * Define all global variables here
 */
/**/
var courseInput = "stfu"; //initialized for now.

//var student_array= [{name:"Harry", course:"Potions", grade:60},{name:"Ron", course:"Biology", grade:30},{name:"Hermione", course:"Writing", grade:98}];
var highest;
var lowest;
var student_array = [];
var ajaxSuccess;
//var courseList = {
//    'mathematics': null,
//    'material science': null,
//    'art science': null,
//}
var courseList = {};
var result;
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
    highlightGrade(student_array);
    console.log('add button is clicked!');
    var empty_message = $('.empty');
        empty_message.remove();
    $(".dropDownShow").remove();
    createStudentDB();
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
        id: null,
       DOMposition:null,
       arrayIndex: arrayIndex,
       self_delete: function(){
           this.DOMposition.remove();
           student_array.splice(this.arrayIndex,1);
           changeIndex(this.arrayIndex);
           console.log('new highest fired');
           console.log('new lowest fired');
           //new_lowest();
           //new_highest();

       }
    };
    student_array.push(student_object);
    addCouseName(student_object.course);
    createStudentDB(student_object);
    console.log(student_array);

}


function createStudentDB(student){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        data: {
            api_key: 'pR7g5hP9J0',
            name: 'student.name',
            course: 'student.course',
            grade: student.grade
        },
        method:'post',
        cache:'false',
        success: function (response) {
            console.log('create student' + response);
            student.id = response.new_id;

        },

})
}



function addCouseName(courseName){
    courseList[courseName] = 1;
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
        text:"User Info Unavailable"
    });
    if (student_array.length == 0){
        $('.student-list tbody').append(empty_student_display);
        empty_student_display.append(empty_display);
    }else{
        for (var i = 0; i<student_array.length; i++){
            addStudentToDom(student_array[i]);
        }
    }
    updateData();
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
        highlightGrade(student_array);
        deleteStudentDB();
        console.log('my element is ',studentObj);
    });
    $('tbody').append(studentRow);
    studentRow.append(studentName, studentCourse, studentGrade, deleteButton);
    studentObj.DOMposition = studentRow;
    //console.log('highest fired');
    //console.log('lowest fired');
    //find_lowest();
    //find_highest();

}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function resetApplication(){
    student_array = [];
    updateStudentList();
    updateData();
}

// autoComplete
// @params: none
// @global: courseList, courseInput
// @return: none
// This function creates the auto complete for a when a user enters a class that was previously stored allowing the user
// to not have to type out the whole class name

function autoComplete() {
    console.log("autocomplete() is invoked!");
    var courseListKeys = Object.keys(courseList); //stores courseList keys into array of strings
    console.log('the list of courses ', courseListKeys);
    //console.log('testing the substring: ', courseListKeys[0].substring(0, courseInput.length));
    console.log('user input in course ', courseInput);

    $(".dropDownShow").remove(); // removes any previous drop downs
    if(courseListKeys.length <= 0){ // if courseList is empty just return
        return;
    }
    for (var i = 0; i < courseListKeys.length; i++) {
        if (courseListKeys[i].substring(0, 2) == courseInput.substring(0, 2)){ // if the first two letters are matching in courseInput and courselist[i]
            var lists = $('<li>', {
                class: "dropDownShow",
                text: courseListKeys[i]
            });
            ////append the text of courseListKeys to the <li>
            $('#courseDropDown').append(lists).css('display', 'block');
            courseListKeys.splice(i, 1);
            i = -1; //set index to -1 so we can start on 0 for the next iteration
        }
    }
    $(".dropDownShow").on("click",function(){
        automaticText($(this).text()); // calls function to change the value
        $(".dropDownShow").remove();
    });

}//END of function

/**
 * Listen for the document to load and reset the data to the initial state
 */

var timer = null;

$(document).ready(function(){
    resetApplication();
    console.log('jquery is fine!');
    $('#course').on('keyup', function(){
        courseInput = $(this).val().toLowerCase(); //toLowerCase for case-insensitivity
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            autoComplete(); //invoke autoComplete function
        }, 500);
    });

    getStudentServerData();
});

/* function:automaticText*/
// @params: value
// @globals: none
// @return: none
// This function sets the value of the form to be whatever you clicked in the dropDown
function automaticText(value){
    $("#course").val(value);
}
function highlightGrade(array) {
    var highestGrade = parseInt(array[0].grade);
    var lowestGrade = parseInt(array[0].grade);
    if (student_array.length >= 2) {
        for (var i = 0; i < student_array.length; i++) {
            if (parseInt(student_array[i].grade) === highestGrade) {
                student_array[i].DOMposition.addClass('bg-success');
            }
            if (parseInt(student_array[i].grade) > highestGrade) {
                highestGrade = parseInt(student_array[i].grade);
                $('.bg-success').removeClass('bg-success');
                student_array[i].DOMposition.addClass('bg-success');
            }
            if (parseInt(student_array[i].grade) === lowestGrade) {
                student_array[i].DOMposition.addClass('bg-danger');
            }
            if (parseInt(student_array[i].grade) < lowestGrade) {
                lowestGrade = parseInt(student_array[i].grade);
                $('.bg-danger').removeClass('bg-danger');
                student_array[i].DOMposition.addClass('bg-danger');
            }

        }
    }
    else{
        $('.bg-danger').removeClass('bg-danger');
        $('.bg-success').removeClass('bg-success');
    }

}
//function find_highest(){
//    console.log('highest recieved');
//        if(student_array.length == 1){
//            highest = student_array[0]
//        }else {
//            if(Number(highest.grade) < Number(student_array[student_array.length-1].grade)){
//                unhighlight(highest);
//                highest = student_array[student_array.length-1];
//            }
//        }
//    highlight_highest();
//    if (student_array.length == 2){ //this part of the function fixes a highlight bug, since the first entry is both highest and lowest
//        highlight_lowest();
//    }
//}
//
//function find_lowest(){
//    console.log('lowest recieved');
//        if(student_array.length == 1){
//            lowest = student_array[0]
//        }else {
//            if(Number(lowest.grade) > Number(student_array[student_array.length-1].grade)){
//                unhighlight(lowest);
//                lowest = student_array[student_array.length-1];
//            }
//        }
//    highlight_lowest();
//}
//
//function unhighlight(highlighted){
//    highlighted.DOMposition.css('background-color','inherit');
//}
//
//function highlight_highest(){
//    highest.DOMposition.css('background-color','green');
//}
//function highlight_lowest(){
//    lowest.DOMposition.css('background-color','red');
//}
//
//function new_highest(){
//    console.log('new highest received');
//    highest = student_array[0];
//    for (var i = 1; i < student_array.length; i++) {
//        if (Number(student_array[i].grade) > Number(highest.grade)) {
//            highest = student_array[i];
//        }
//    }
//    highlight_highest();
//}
//
//function new_lowest(){
//    console.log('new lowest recieved');
//    lowest = student_array[0];
//    for (var i = 1; i < student_array.length; i++) {
//        if (Number(student_array[i].grade) < Number(lowest.grade)) {
//            lowest = student_array[i];
//        }
//    }
//    highlight_lowest();
//}
function getStudentServerData(){
    $.ajax({
        dataType:'json',
        url:'http://s-apis.learningfuze.com/sgt/get',
        data:{
            api_key:'pR7g5hP9J0'
        },
        method:'post',
        cache:'false',
        success:function(response){
            console.log('success function called' +response);
            for(var i = 0; i < response.data.length; i++){
                student_array.push(response.data[i]);
                response.data[i].DOMposition=null;
                    response.data[i].arrayIndex=student_array.length;
                response.data[i].self_delete = function(){
                    this.DOMposition.remove();
                    student_array.splice(this.arrayIndex,1);
                    changeIndex(this.arrayIndex);
                    //console.log('new highest fired');
                    //console.log('new lowest fired');
                    highlightGrade(student_array);
                    //new_lowest();
                    //new_highest();

                }

            }
            updateStudentList();

        },
        error: function(response){
            console.log ('There is an error!')
        }
    });
}
var output;
function deleteStudentDB (studentObj){
    var studentID = studentObj.id;
    $.ajax({
        dataType:'json',
        url:'http://s-apis.learningfuze.com/sgt/delete',
        data:{
            api_key:'pR7g5hP9J0',
            id:(studentID)
        },
        method:'post',
        cache:'false',
        success:function(response){
            console.log('deletestudent'+response)
            output=response;
                }

            })
            //updateStudentList();
}

//        },
//        error: function(response){
//            console.log ('There is an error!')
//        }
//    });
//}
//function getServerData(){
//    $.ajax({
//        dataType: 'json',
//        data:{
//            api_key:'LEARNING'
//        },
//        method:'POST',
//        cache: false,
//        url: 'http://s-apis.learningfuze.com/sgt/get',
//        success: function (response) {
//            console.log('AJAX Success function called, with the following result:', response);
//            ajaxSuccess=response.data;
//            for (var i=0;i<ajaxSuccess.length;i++){
//                student_array.push(ajaxSuccess[i]);
//            }
//            updateStudentList();
//
//        },
//        error: function (response) {
//            console.log("error message");
//        }
//    });
//}