var physician_assistant = angular.module('physician-assistant',['ngRoute']);


physician_assistant.factory('PhysicianAssistantService', ['$q','$http', function ($q, $http) {
    return {
        create_diagnose: function(data){
            var defer = $q.defer();
            $http.post('/api/diagnose',data).then(function(response){
                defer.resolve(response.data);
            });

            return defer.promise;
        },
        get_likely_diagnose: function(params){
            var defer = $q.defer();
            $http.get('/api/diagnose'+params).then(function(response){
                defer.resolve(response.data);
            });

            return defer.promise;
        }
    }
}]);

physician_assistant.factory('FacebookService', ['$q', function ($q) {
    return {
        login: function () {
            var defer = $q.defer();
            FB.login(function (response) {
                if (response.authResponse) {
                    defer.resolve(response);
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {scope: 'public_profile,email'});
            return defer.promise;
        }
    }
}]);

physician_assistant.run(function($rootScope,$location,FacebookService){
    $rootScope.facebook_login = function(){
        FacebookService.login().then(function(response){
            if(response.status == 'connected'){
                FB.api('/me',function(user){
//                    localStorage.setItem('user',JSON.stringify({id:user.id, name: user.name}));
//                    $location.url('/auctions/create');
                })
            }

        });
    }
});


physician_assistant.config(['$routeProvider',function($routeProvider){
    $routeProvider
        .when('/diagnose',{
            controller:'DiagnoseController',
            templateUrl:'/public/views/diagnose.html'
        })
        .when('/',{
            controller:'HomeController',
            templateUrl:'/public/views/home.html'
        }).otherwise({redirect:'/'});
}]);

physician_assistant.controller('HomeController',function($scope,$location){
    $scope.init = function(){

    };

    $scope.$on('$viewContentLoaded',function(){

    });


});

physician_assistant.controller('DiagnoseController',function($scope,PhysicianAssistantService){
    $scope.init = function(){
        $scope.symptoms = [];
        $scope.likely_diagnoses = [];
    };

    $scope.$on('$viewContentLoaded',function(){

    });

    $scope.add_symptom = function(event){
        if(event.which == 13){
            $scope.symptoms = [$scope.symptom].concat($scope.symptoms);
            $scope.symptom = null;

            PhysicianAssistantService.get_likely_diagnose('?symptoms='+$scope.symptoms.join(',')).then(function(data){
                $scope.likely_diagnoses = data.results;
            });
        }
    }

    $scope.create_diagnose = function(){
        PhysicianAssistantService
            .create_diagnose({diagnose:$scope.diagnose, symptoms: $scope.symptoms, comment: $scope.comment})
            .then(function(data){
                $scope.diagnose = null;
                $scope.symptoms = [];
                $scope.comment = null;
            });
        return false;
    }


});



