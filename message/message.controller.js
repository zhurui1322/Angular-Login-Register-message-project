
    'use strict';

    angular
        .module('app')
        .controller('MessageController', MessageController);


    MessageController.$inject = ['$location', '$scope', 'UserService', '$rootScope', '$http', '$filter'];
    function MessageController($location, $scope, UserService, $rootScope, $http, $filter) {
      
        
       

        $scope.messages = getMessages();
        var vm = this;
        vm.user = null;
        loadCurrentUser();

        


        

        $scope.propertyName = 'created_at';
        $scope.reverse = true;
        $scope.messages = $filter('orderBy')($scope.messages, $scope.propertyName, $scope.reverse);

        $scope.sortBy = function(propertyName) {
            $scope.reverse = (propertyName !== null && $scope.propertyName === propertyName)
                ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
            $scope.messages = $filter('orderBy')($scope.messages, $scope.propertyName, $scope.reverse);
        };   


        function loadCurrentUser() {
            UserService.GetByUsername($rootScope.globals.currentUser.username)
                .then(function (user) {
                    vm.user = user;
                });
        };


        $scope.go = function(message) {
            var url = '/messagedetail/' + message.id;
            $location.path(url);
        };


        function getMessages() {
            if(!localStorage.messages){
                    $http.get('data.json').then(function(data) {
                        $scope.messages = data.data;
                        localStorage.messages = JSON.stringify($scope.messages);
                        return JSON.parse(localStorage.messages);
                    });
            } else { 
                return JSON.parse(localStorage.messages);
            }
        };

        function setMessages(messages) {
            localStorage.messages = JSON.stringify(messages);
        };


        $scope.addMessage = function() {
           // console.log($scope.myTextarea);
           // console.log(vm.user.username);
            var datetime = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
           // console.log(datetime);
            //console.log(vm.message.comments.length);
            console.log($scope.messages.length);

             $scope.messages.push({
                "id": $scope.messages.length,
                "recipient": $scope.myRecipient,
                "recipient_img": "https://freeiconshop.com/wp-content/uploads/edd/person-flat.png",
                "sender": vm.user.username,
                "sender_img": vm.user.avatar,
                "title": $scope.myTitle,
                "description":$scope.myTextarea,
                "created_at": datetime,
                "important": "0",
                "comments": []
            });   
             setMessages($scope.messages)
            $scope.myTextarea = "";
            //updateMessage();   
        }


    };


    // "id": "2",
    // "recipient": "Arun",
    // "recipient_img": "https://freeiconshop.com/wp-content/uploads/edd/person-flat.png",
    // "sender": "zhurui1322",
    // "sender_img": "https://freeiconshop.com/wp-content/uploads/edd/person-outline-filled.png",
    // "title": "This is a sample message to Arun From JieZhou.",
    // "description": "This is a sample description to the message which has the above title",
    // "created_at": "2016-12-05 14:45:00",
    // "important": "3",
    // "comments": []