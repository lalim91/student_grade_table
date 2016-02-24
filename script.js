/**
 * Define all global variables here
 */
/**/
var courseInput = "stfu"; //initialized for now.
var student_array = [];
var ajaxSuccess;
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
            //console.log('new highest fired');
            //console.log('new lowest fired');
            //new_lowest();
            //new_highest();

        }
    };
    student_array.push(student_object);
    addCourseName(student_object.course);
    createStudentDB(student_object);
    console.log(student_array);

}


function createStudentDB(student){
    $.ajax({
        dataType: 'json',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        data: {
            api_key: 'pR7g5hP9J0',
            name: student.name,
            course: student.course,
            grade: student.grade
        },
        method:'post',
        cache:'false',
        success: function (response) {
            console.log('create student' + response);
            result=response;
            student.id = result.new_id;

        },

    })
}



function addCourseName(courseName){
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

    for (var i = 0; i<student_array.length; i++){
        addStudentToDom(student_array[i]);
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
        deleteStudentDB(studentObj);
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

    //getStudentServerData();

    $('#load').on('click', function(){
        //getStudentServerData();
            var $this = $(this);
            $this.button('loading');
            setTimeout(function() {
                $this.button('reset');
            }, 2000);
    }
        )
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

function deleteStudentDB (studentObj){
    $.ajax({
        dataType:'json',
        url:'http://s-apis.learningfuze.com/sgt/delete',
        data:{
            api_key:'pR7g5hP9J0',
            student_id:studentObj.id
        },
        method:'post',
        cache:'false',
        success:function(response){
            console.log('deletestudent'+response);
            console.log(studentObj.id+" is deleted");

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









