var editor;
var projectFormsTable;
var questions;
var choices;
jQuery(document).ready(function($){
  console.log("stats4sd-js kobo Starting again");

  console.log("current user", vars.user_group_ids);

  setup_project_forms_table();

  project_list = vars.user_groups;
  console.log("projects = ",project_list)

  $('#project_list').html("<div class='list-group'>");
  project_list.forEach(function(item,index){

    //item is group_id; 
    //
    //get group name and kobotools ID:
    group_name = item.name;
    kobotools_account = item.kobotools_account;
    slug = item.slug

    if(kobotools_account==""){
      kobotools_account = "**blank**"
    }

    $('#project_list').append("<div class='list-group-item'><span class='font-weight-bold'>" + group_name+" </span>  <a href='"+vars.site_url+"/groups/"+slug+"'>View / Edit project</a></div>");
  })

    $('#project_list').append("</div>");



// PreGet Data for form prep:
  questionGet = getData(vars,"dt_xls_form_questions")
  .done(function(response){
  //  console.log("questions back = ",response.data);

    questionSet = response.data.map(function(item,index){
      return item.xls_form_questions;
    })

    questions = questionSet;
  })
  .fail(function(){
    questions = 'error';
    console.log("could not get xls form questions");
  })

  choicesGet = getData(vars,"dt_xls_form_choices")
  .done(function(response){
    choicesSet = response.data.map(function(item,index){
      return item.xls_form_choices;
    })

    choices = choicesSet;
  })


}); //end doc ready;


function update_locations(id,kobo_id=null){

  var data = projectFormsTable.rows(id).data().toArray();
  console.log(data);

  var send = {}
  send.project_id = data[0].project_forms_info.project_id;
  console.log("send",send);
  //get locations data from database
  getLocations = getData(vars,"dt_locations_csv",send)
    .done(function(response){
      console.log(response);

      locations = response.data.map(function(item,index){
        return item.locations_csv;
      })
      console.log("got locations! = ", locations);


      if(!kobo_id){
        if(data[0].project_forms_info.form_kobo_id != null && data[0].project_forms_info.form_kobo_id != "") {
          kobo_id = data[0].project_forms_info.form_kobo_id;
        }
        else {
          console.log("no kobo form id defined / found!");
          return;
        }
      }

      csvUpload = {
        data_type: "media",
        data_value: "locations.csv",
        xform: kobo_id,
        data_file: locations
      }

      console.log("csvToUpload = ",csvUpload)

      //add locations csv file to the form
      jQuery.ajax({
        url: vars.node_url + "/addCsv",
        method: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(csvUpload),
        success: function(response){
          console.log("response from csv upload = ",response);
        },
        error: function(response){
          console.log("error from csv upload = ",response);
        }
      }) //end sharing requiest

    })

     


}

function deploy_form(id){
  var form = {};
  //get row data;
  var data = projectFormsTable.rows(id).data().toArray();
  var recordId = data[0].project_forms_info.id;
  var form_type_id = data[0].project_forms_info.form_id;
  console.log(data)

  //take form_id and get build form:...
  form.survey = prepare_survey(data[0].project_forms_info.form_id);
  form.choices = prepare_choices(form.survey);
  form.settings = prepare_settings(data[0]);
  console.log(form);

  form.name = form.settings.form_title
  // console.log("vars = ",vars);
  //send the form off to node:
    jQuery.ajax({
      url: vars.node_url + "/customDeployForm",
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(form),
      success: function(response){
        console.log("success",response);

        if(response.msg.url){
          //setButtons();


          form.kobo_id = response.msg.formid;

          console.log("form kobo ID = ",form.kobo_id);

          //save kobo_id to the projects_forms tabls for later reference;
          jQuery.ajax({
            url: vars.ajax_url,
            method: "POST",
            data: {
              kobo_id: form.kobo_id,
              id: recordId,
              action: "kobo_form_save_id",
              secure: vars.nonce
            }
          })
          .done(function(response){
            console.log("response from kobo_id db update:",response);
          })
          .fail(function(response){
            console.log("fail from kobo_id db update",response);
          })
            

          //reload table data;
          projectFormsTable.ajax.reload();




          if(form_type_id == 1){
            update_locations(id,form.kobo_id);
          }
         


          //take project_kobo_account, then add sharing permissions via Kobo API.
          kobotools_account = data[0].project_forms_info.project_kobotools_account;
          console.log('kobotools sharing account = ',kobotools_account)
          shareBody = {};
          shareBody.form_id = form.kobo_id;
          shareBody.username = kobotools_account;
          shareBody.role = "manager";



          console.log("share body",shareBody);

          jQuery.ajax({
            url: vars.node_url + "/shareForm",
            method: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(shareBody),
            success: function(response){
              console.log("response from sharing = ",response);
            },
            error: function(response){
              console.log("error from sharing = ",response);
            }
          }) //end sharing requiest


        }
        else {

//          setButtons();
  //        user_alert("Test form was uploaded but encountered ODK errors","warning","alert-space");

          
          text = "ODK error: " + response.msg.text;
          console.log("error, ", response.msg.text)
          // user_alert(text,"danger");


        }
      },
      error: function(response){
        console.log("error",response);
        // working();
        // user_alert("error - the form could not be deployed to Kobotools.","danger","alert-space");
        // setButtons();
        //user_alert("Server error message: " + response.error(),"danger");
      }
   })

}


//returns json object for the survey sheet.
function prepare_survey(form_id) {
 //console.log("form_id", form_id);
  var survey = [];
  survey = questions.filter(function(item,index){
    //console.log("item",item);
    if(item.form_id == form_id){
      return true;
    }
    return false;
  })


  return survey;


}

//function takes list of questions and prepares the choices sheet to include all required choice lists;
//returns json object for the choices sheet
function prepare_choices(questions) {

  // Matches lookups from 'select_one [choices]' and 'select_multiple [choices]'
  // Always include the placeholder choice, so the sheet headers are always rendered.
  var choicesTracker = ['na'];


  //go through every question in survey:
  questions.forEach(function(question,index){
    console.log("question");
    // match select questions, and track the second term (choices reference)
    if(question.type.indexOf("select") > -1) {
      console.log("is select !");
      //split select by the space to get just the choices list name:
      var meta = question.type.split(" ")

      //add the choices list name to the choicesTracker with a value of true
      choicesTracker.push(meta[1]);
    }
  })

  console.log("choicesTracker",choicesTracker)

  console.log("choices inside prepare_choices function",choices);
  //go through all the choices, and if their list_name matches one of the choicesTracker items, add it to selectedChoices.
    var selectedChoices = jQuery.map(choices,function(item,index){
    if(choicesTracker.some(i => i == item.list_name)) {
      return item;
    }
  })

  return selectedChoices;
}


function prepare_settings(data){

  settings = [data.xls_forms];
  console.log(data.project_forms_info.project_name);
  pName = data.project_forms_info.project_name.toLowerCase();
  pName = pName.replace(/\s/g,"-")
  settings[0].form_id = pName + "_" + settings[0].form_id;
  settings[0].form_title = pName + " - " + settings[0].form_title;

  //testing only 
  settings[0].form_id += "_test_" + Math.floor((Math.random() * 100000) + 1).toString()

  return settings;
}


function setup_project_forms_table() {
    //Setup datatables columns:
  var projectFormsColumns = [
    {data: "project_forms_info.id", title: "ID", visible: false},
    {data: "project_forms_info.project_id", title: "Project ID", visible: false},
    {data: "project_forms_info.project_name", title: "Project Name", visible: true},
    {data: "project_forms_info.project_kobotools_account", title: "Project Name", visible: false},
    {data: "project_forms_info.project_slug", title: "Project Slug", visible: false},
    {data: "project_forms_info.form_id", title: "Form ID", visible: false},
    {data: "xls_forms.form_title", title: "Form Type", visible: true},
    {data: "project_forms_info.form_kobo_id", title: "Kobotools Form ID", visible: true},
    {data: "project_forms_info.project_kobotools_account", title: "Edit",visible:true, render: function(data,type,row,meta){
      console.log("row = ",row);

      //if no kobotools account is defined, direct user to add one:
      if(data == "" || data == null){
        slug = row.project_forms_info.project_slug
        return "<a class='btn btn-link' href='"+vars.site_url + "/groups/" + slug+"'>Add Kobotools Account</a>";
      }

      //if form is deployed, suggest updating locations csv file
      if(row.project_forms_info.form_kobo_id != null && row.project_forms_info.form_kobo_id != ""){

        //only offer locations update for intake form:
        if(row.project_forms_info.form_id == 1){
          return "<button class='btn btn-link' onclick='update_locations("+meta.row+")'>update locations csv</button'"  
        }
        return "form deployed"
        
      }
        return "<button class='btn btn-link' onclick='deploy_form("+meta.row+")'>deploy form</button>";
    }},
  ];

  //datatables parameters
  projectFormsParams = {
    vars: vars,
    action: "dt_project_forms",
    target: "DataTable",
    columns: projectFormsColumns,
    }

  //call datatables function
  projectFormsTable = newDatatable(projectFormsParams);

}