var app = angular.module('sgtApp', ['firebase']);

app.service('sgtService', function () {
    var self = this;
    this.firebaseRef = new Firebase("https://lfchallenge.firebaseio.com/students");
    this.studentObj = {};

    this.addStudent = function () {
        self.firebaseRef.push(this.studentObj);
        this.studentObj = {};
    };

    this.deleteStudent = function(key){
        self.firebaseRef.child(key).remove();
    }
});



app.controller('formController', function (sgtService, $firebaseObject) {
    this.studentList = $firebaseObject(sgtService.firebaseRef);

    this.addStudent = sgtService.addStudent;

    this.deleteStudent = sgtService.deleteStudent;



});






