
$(document).ready(function () {
    console.log('Viewing flat');
    $("#hello").click(clickHandler);
});

function clickHandler(e) {
  console.log('Adding flat');

  v = chrome.tabs.getSelected(null, function(tab) { //<-- "tab" has all the information
      url =tab.url;       //returns the url
      title = tab.title;     //returns the title
      console.log("lllllllll", url);
      console.log("lllllllll", title);

    d ={
      'job_title': title,
      'url': url,
      'stage': 'toApplay',
      'deadline':'hhhkkhkh',
      'tasks': [],
      'url_id': 1
   }
   createNewJobInfo(d);
  });

  console.log(v)


}

function createNewJobInfo (jobData) {
    headers = {
      "Content-Type": "application/json",
      "Authorization": "Token ddd3d4bb849e978e1f4627945bc44d89d5ff3e46"
    }
    // jobData.job_url = jobData.url.url;
    $.ajax({
      method: 'POST',
      url: 'https://www.worktojob.com/jobs',
      header: headers,
      data:jobData,
    }).done(function (data) {
        if(data.status == 201){
            console.log("............................", data)
        }
    }).fail(function (error) {
        if(error.status == 401){
            console.log(".............error...............", error)
            
        }
    });
 };
