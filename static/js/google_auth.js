$(function() { 
    $('#gSignInWrapper').ready(function(e)  {
        var googleUser = {};
        gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: '1001106296838-e9539dtafe2fjn2hgdig5bimjfgbi70m.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
              // Request scopes in addition to 'profile' and 'email'
              //scope: 'additional_scope'
            });

            auth2.attachClickHandler(document.getElementById("gSignInBtn"), {},
                function(googleUser) {
                  //get New page from workto job
                }, 

                function(error) {
                    alert(error)
                }
            );
        });
    });

    $('#gSignUpWrapper').ready(function(e)  {
        var googleUser = {};
        gapi.load('auth2', function(){
        // Retrieve the singleton for the GoogleAuth library and set up the client.
            auth2 = gapi.auth2.init({
                client_id: '1001106296838-e9539dtafe2fjn2hgdig5bimjfgbi70m.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
              // Request scopes in addition to 'profile' and 'email'
              //scope: 'additional_scope'
            });

            auth2.attachClickHandler(document.getElementById("gSignUpBtn"), {},
            function(googleUser) {
              //Add user to worktojob db and get new page
            }, 

            function(error) {
            });

        });
    });



});

