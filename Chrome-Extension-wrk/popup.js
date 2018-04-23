/**
 * Code for the popup UI.
 */
Popup = {

  // Is this an external popup window? (vs. the one from the menu)
  is_external: false,

  // Options loaded when popup opened.
  options: null,

  // Info from page we were triggered from
  page_title: null,
  page_url: null,
  page_selection: null,
  favicon_url: null,

  // State to track so we only log events once.
  has_edited_name: false,
  has_edited_url: false,
  has_reassigned: false,
  has_used_page_details: false,
  is_first_add: true,

  // Data from API cached for this popup.
  workspaces: null,
  users: null,
  user_id: null,
  
  // Typeahead ui element
  typeahead: null,


   showAddUi: function(url, title, selected_text, favicon_url) {
    var me = this;

    // Store off info from page we got triggered from.
    me.page_url = url;
    me.page_title = title;
    me.page_selection = selected_text;
    me.favicon_url = favicon_url;

  },

  onLoad: function() {
    var me = this;

    // Ah, the joys of asynchronous programming.
    // To initialize, we've got to gather various bits of information.
    // Starting with a reference to the window and tab that were active when
    // the popup was opened ...
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      var tab = tabs[0];

      // Now load our options ...
      Asana.ServerModel.options(function(options) {
        me.options = options;
        // And ensure the user is logged in ...


        
        Asana.ServerModel.isLoggedIn(function(is_logged_in) {
          console.log('.........................','logged in', is_logged_in)
          if (is_logged_in != 'false') {
            $('#login_view').hide();
            $('#add_view').show();
            me.showAddUi(tab.url, tab.title, '', tab.favIconUrl);
            console.log(',,,',tab.url, tab.title,tab.favIconUrl);
          } else {
            // The user is not even logged in. Prompt them to do so!
            me.showLogin(
                Asana.Options.loginUrl(options),
                Asana.Options.signupUrl(options));
          }
        });
      });
    });

    // Wire up some events to DOM elements on the page.

    $(window).keydown(function(e) {
      // Close the popup if the ESCAPE key is pressed.
      if (e.which === 27) {
        if (me.is_first_add) {
          Asana.ServerModel.logEvent({
            name: "ChromeExtension-Abort"
          });
        }
        window.close();
      } else if (e.which === 9) {
        // Don't let ourselves TAB to focus the document body, so if we're
        // at the beginning or end of the tab ring, explicitly focus the
        // other end (setting body.tabindex = -1 does not prevent this)
        if (e.shiftKey && document.activeElement === me.firstInput().get(0)) {
          me.lastInput().focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === me.lastInput().get(0)) {
          me.firstInput().focus();
          e.preventDefault();
        }
      }
    });

    // Close if the X is clicked.
    $(".close-x").click(function() {
      window.close();
    });

    // The page details button fills in fields with details from the page
    // in the current tab (cached when the popup opened).
    get_page_url_title = function() {
        // Page title -> task name
        $("#name_input").val(me.page_title);
        // Page url + selection -> task url
        var url = $("#url_data");
        url.text(me.page_url.substring(0, 45));
        url.attr("href", me.page_url);

        // url.innerHTML = me.page_url;
        // url.val(url.val() + me.page_url + "\n" + me.page_selection);
        console.log('note vaue' , url.text());
        // Disable the page details button once used.        
        if (!me.has_used_page_details) {
          me.has_used_page_details = true;
        }
    };



    var use_page_details_button = $("#use_page_details");
    use_page_details_button.click(function() {
      if (!(use_page_details_button.hasClass('disabled'))) {
        // Page title -> task name
        $("#name_input").val(me.page_title);
        // Page url + selection -> task url
        var url = $("#url_data");
        url.val(url.val() + me.page_url + "\n" + me.page_selection);
        // Disable the page details button once used.        
        use_page_details_button.addClass('disabled');
        if (!me.has_used_page_details) {
          me.has_used_page_details = true;
          Asana.ServerModel.logEvent({
            name: "ChromeExtension-UsedPageDetails"
          });
        }
      }
});


setTimeout(
  function() 
  {
    get_page_url_title();
  }, 1000);


$(function() {
    $( "#deadline" ).datepicker();
    $( ".task_deadline" ).datepicker();
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today =  month + "/" + day+ "/"+year; 
    $('#deadline').val(today);
    $('.task_deadline').val(today);

});


  },


  showView: function(name) {
    ["login", "add"].forEach(function(view_name) {
      $("#" + view_name + "_view").css("display", view_name === name ? "" : "none");
    });
  },

  showAddUi: function(url, title, selected_text, favicon_url) {
    var me = this;

    // Store off info from page we got triggered from.
    me.page_url = url;
    me.page_title = title;
    me.page_selection = selected_text;
    me.favicon_url = favicon_url;

  },


  showError: function(message) {
    console.log("Error: " + message);
    $("#error").css("display", "inline-block");
  },

  hideError: function() {
    $("#error").css("display", "none");
  },

 
 /**
   * Show the login page.
   */
  showLogin: function(login_url, signup_url) {
    var me = this;
    $("#login_button").click(function() {
      var username = $('#username').val();
      var password = $('#password').val();
      loginValidation({'username': username, 'password': password})
      Popup.onLoad();
    });
    $("#signup_button").click(function() {
      chrome.tabs.create({url: 'https://worktojob.com'});
      window.close();
      return false;
    });
    me.showView("login");
  },


  firstInput: function() {
    return $("#workspace_select");
  },

  lastInput: function() {
    return $("#add_button");
  }
};

 $("#add_button").click(function() {
    createNewJobInfo();

 });

function createNewJobInfo () {

  var today = new Date();

  var userData = {
      'url_id': 1,
      'job_title': $('#name_input').val(),
      'url': $('#url_data').val(),
      'tasks': [],
      'deadline': new Date(),
      'stage': $('#stage').val()

  }
  var headers = {
      "Content-Type": "application/json",
      "Authorization": "Token " + window.localStorage.getItem('wrk_token')
  }

  console.log(userData)

  $.ajax('http://worktojob.com/jobs', 
  {   
      headers: headers,
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      data: JSON.stringify(userData),
      success: function (data) {   // success callback function

          $('#success').show();
      },
      error: function (error) { // error callback 
          if(error.status == 401){
            window.localStorage.setItem('wrk_token', false)
            Popup.onLoad();
          }
          $('#error').show(); 
      }
  });

};

function loginValidation (userData) {
  var headers = {
      "Content-Type": "application/json",
  }


  $.ajax('http://worktojob.com/auth_login', 
  {   
      header: headers,
      dataType: 'json',
      type: 'POST',
      data: userData,
      success: function (data) {   // success callback function
          console.log('data--------------', data);
          window.localStorage.setItem('wrk_token', data['token']);
          Popup.onLoad();
      },
      error: function (error) { // error callback 
          console.log('data--------------', error);   
      }
  });

};



$(window).load(function() {
  Popup.onLoad();
});
