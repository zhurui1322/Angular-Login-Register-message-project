
    'use strict';

    angular
        .module('app')
        .controller('MessageDetailController', MessageDetailController);


    MessageDetailController.$inject = ['$location', '$scope', 'UserService', '$rootScope', '$http', '$filter','$routeParams'];
    function MessageDetailController($location,$scope, UserService, $rootScope, $http, $filter, $routeParams) {
        
        
        var vm = this;
        vm.user = null;
        vm.message = GetById($routeParams.id);
        loadCurrentUser();



        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        };


        function GetById(id) {
            var filtered = $filter('filter')(getMessages(), { id: id });
            var messages = filtered.length ? filtered[0] : null;
            return messages;        
        }


        function getMessages() {
            $scope.messages = [];
            if(!localStorage.messages){
                    $http.get('data.json').then(function(data) {
                    $scope.messages = data.data;
                    localStorage.messages = JSON.stringify($scope.messages);
                    return localStorage.messages;
                });
            }

            return JSON.parse(localStorage.messages);
        };

        function setMessages(messages) {
            localStorage.messages = JSON.stringify(messages);
        };


        $scope.delete = function(message) {
            var messages = getMessages();
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].id === vm.message.id) {
                    messages.splice(i, 1);
                    break;
                }
            }
            setMessages(messages);
            var url = '/message/';
            $location.path(url);
        };

        $scope.decrease = function(message) {
            var important = parseInt(message.important);
            if(important > 1) {
                important -= 1;
                vm.message.important = important.toString();
                updateMessage();
            }
        };

        $scope.increase = function(message) {
            var important = parseInt(message.important);
            if(important < 9) {
                important += 1;
                vm.message.important = important.toString();
                updateMessage();
           }
        };


        function updateMessage() {
            var messages = getMessages();
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].id === vm.message.id) {
                    messages[i] = vm.message;
                    break;
                }
            }
            setMessages(messages);
        };


        $scope.addComment = function() {
           // console.log($scope.myTextarea);
           // console.log(vm.user.username);
            var datetime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
           // console.log(datetime);
            //console.log(vm.message.comments.length);
            var indexOfComments = vm.message.comments.length;

            vm.message.comments.push({
                "sender_img": vm.user.avatar,
                "sender": vm.user.username,
                "content": $scope.myTextarea,
                "created_at": datetime
            });   

            $scope.myTextarea = "";
            updateMessage();   
        }

    };
