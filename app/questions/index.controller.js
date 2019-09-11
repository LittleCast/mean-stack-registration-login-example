(function () {
    'use strict';

    angular
        .module('app')
        .controller('Questions.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.addQuestion = addQuestion;
        vm.removeQuestion = removeQuestion; 
        vm.updateQuestions = updateQuestions;
        vm.orderUp = orderUp;
        vm.orderDown = orderDown;


        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function orderUp(index)
        {
            var x = vm.user.questions.splice(index, 1);
            vm.user.questions.splice(index-1, 0, x[0]);
            saveUser();
        }
        function orderDown(index)
        {
            var x = vm.user.questions.splice(index, 1);
            vm.user.questions.splice(index+1, 0, x[0]);
            saveUser();
        }

        function addQuestion()
        {
            updateQuestions(true);
            document.getElementById("qnew").value = "";
        }

        function removeQuestion(id)
        {
            document.getElementById(id).value = "";
            updateQuestions(false);
        }

        function updateQuestions(addNew)
        {
            var count = 1;
            var questionsArray = [];
            var qList = document.getElementsByClassName("questionTextBox");
            for(var q of qList)
            {
                if(q.value && q.value != "")
                {
                    if(q.id == "qnew" && addNew)
                    {
                        var qObj = {
                            id: count,
                            value: q.value
                        };
                        questionsArray.push(qObj);
                        count++;
                    }
                    else if(q.id != "qnew")
                    {
                        var qObj = {
                            id: count,
                            value: q.value
                        };
                        questionsArray.push(qObj);
                        count++;
                    }
                }        
            }
            vm.user.questions = questionsArray;
            saveUser();
        }

        function saveUser()
        {
            UserService.Update(vm.user)
                .then(function () {
                    //FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }
})();