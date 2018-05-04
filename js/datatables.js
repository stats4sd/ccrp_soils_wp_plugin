/****** GENERIC FUNCTIONS FOR DATATABLES EDITOR, CUSTOMISED FOR WORDPRESS ENVIRONMENT ******
* The first functions initialise the datatables and editor objects in JS with a set of default options.
* Other functions make common tasks with datatables (rendering, filtering) easier.
*/


//////////////////////////////////////////////////////////////////////////
// ***** INITIALISE DATATABLES **** //
//////////////////////////////////////////////////////////////////////////


// *** NEW DATATABLE ***
// Initialises a new Datatable, given the correct parameters:
// Accepts an object:
// params = {
//    vars: The set of wp-localized variables, passed from php. (object)
//    action: the wp-ajax action to call via ajax (string)
//    columns: an array of columns (array)
//    target: The id of the <table> tag to initialise on the page. (string, optional)
//    editor: the associated datatables editor (initialised editor object, optional)
//    options: an object with Datatables options (https://datatables.net/reference/option/). Any options specified here will override the default options specified in getDtOptions().
// }
function newDatatable(params){


  //check that the params has the required properties:
  if(!params.hasOwnProperty("vars")){
    console.log("please specify the localised 'vars' property");
return ({"err": "please specify the localised 'vars' property"});
;
  }

  if(!params.hasOwnProperty("action")){
    console.log("please specify the localised 'action' property");
return ({"err": "please specify the localised 'action' property"});
;
  }

  if(!params.hasOwnProperty("columns")){
    console.log("please specify an array of columns for the datatable;");
return ({"err": "please specify an array of columns for the datatable;"});

  }

  if(!params.hasOwnProperty("target")){
    console.log("please specify the 'target' property (the html element ID to put the datatable into");
return ({"err": "please specify the 'target' property (the html element ID to put the datatable into"});
;
  }

  //get the options object based on params:
  var dt_options = getDtOptions(params);
  console.log("dt_options,",dt_options)

  //initialise the datatable on the 'target' html element.
  var datatable = jQuery('#'+params.target).DataTable(dt_options);
  console.log("dt created",datatable);
  //run the post-init functions to hook into the DataTables events:
  dt_tables_init(datatable,params)




  //return the initialised datatables object.
  return datatable;
}

// ** GET DT OPTIONS **
// Returns an object of customised options for front-end datatables;
// parameters:
//    columns: an array of columns;
//    editor: the associated datatables editor;
//    action: the wp-ajax action to call via ajax;
//    vars: The set of wp-localized variables, passed from php.
function getDtOptions(params){

  var buttons = [
    {
      extend: "csv",
      text: "Download CSV"
    }
  ]

  //if editor is specified, add links to the editor:
  if(params.hasOwnProperty("editor")){
    
    //push the 'create' and 'remove' options to the buttons set:
    buttons.push({extend: "create",editor: params.editor});

    buttons.push({extend: "remove",editor: params.editor})

    //set a default
    if(!params.hasOwnProperty("editColumn")){
      params.editColumn = true;
    }

    //if the edit column is true, add the column.
    if(params.editColumn){
       //add an "edit" column to the array of columns:
      params.columns.push({data: null, className: "center", defaultContent: '<a href="" class="editor_edit">Edit</a>'})
    }

  }

  //initialise options object with default settings, passing in params where needed;
  var options = {
    dom: "fritpB",
    ajax: {
      url: params.vars.ajax_url,
      data: {
        action: params.action,
        secure: params.vars.nonce,
        vars: params.vars

      }
    },
    columns: params.columns,
    select: true,
    buttons: buttons,
    pageLength: 150,
    };

    //if buttons_target is specified, modify the DOM rendering option
    if(params.hasOwnProperty("buttons_target")){
      options.dom = "rt"
    }

    //If there are options specified in the params, go through and add or overwrite those to the options object.
    if(params.hasOwnProperty("options")){
      var extras = params.options;
      Object.keys(extras).forEach(function(key) {
        options[key] = extras[key];
      });
    }



    //return the options object;
    return options;
}

// *** DATATABLES INIT ***
// Function that runs some custom code for all datatables created.
// Includes:
//    Setup the inline 'edit' buttons
function dt_tables_init(datatable,params) {
  
   
  //if an editor is specified, setup the "edit" buttons for each row.
  if(params.hasOwnProperty("editor")){
      datatable.on('click', 'a.editor_edit', function (e) {
      e.preventDefault();

      params.editor.edit( jQuery(this).closest('tr'), {
          title: 'Edit record',
          buttons: 'Update'
      } );
  } );
  }

  //if a buttons_target is specified; render the buttons:
  if(params.hasOwnProperty("buttons_target")){
    console.log("has buttons target");
    console.log("buttons target = ", params.buttons_target);

    datatable.on('init.dt',function(){
      console.log("dt complete init");
      datatable
      .buttons()
      .container()
      .appendTo(jQuery('#'+params.buttons_target));
    })
    
  }



}


//////////////////////////////////////////////////////////////////////////
// ***** INITIALISE DATATABLES EDITORS **** //
//////////////////////////////////////////////////////////////////////////

// *** NEW EDITOR ***
// Initialises a new Editor, given the correct parameters:
// Accepts a params object:
// params = {
//    vars: the set of wp-localized variables, passed from php (object)
//    action: the wp-ajax action to call for data (string)
//    fields: an array of "field-options" objects defining the fields that the editor will expose. (See https://editor.datatables.net/reference/type/field-options)
//    table: the <div> id of the associated datatable (string - optional; do not include for editors not attached to a table);
//    options: any custom options to add to or override the defaults (object - optional) - see https://editor.datatables.net/reference/option/)
//    template: the <div> id of the template to use for the editor (string - optional); - see https://editor.datatables.net/reference/option/template
// }
function newEditor(params){

  //check that the params has the required properties:
  if(!params.hasOwnProperty("vars")){
    console.log("please specify the localised 'vars' property");
return ({"err": "please specify the localised 'vars' property"});
;
  }

  if(!params.hasOwnProperty("action")){
    console.log("please specify the localised 'action' property");
return ({"err": "please specify the localised 'action' property"});
;
  }

  if(!params.hasOwnProperty("fields")){
    console.log("please specify an array of fields for the editor;");
return ({"err": "please specify an array of fields for the editor;"});

  }

  //get the options:
  var editorOptions = getEditorOptions(params)
  
  //initialise the editor:
  var editor = new jQuery.fn.dataTable.Editor(editorOptions);
  
  //run the post-init functions to hook into the editor events;
  dt_editor_init(editor)
  return editor;
}

// *** GET Editor Options ** 
// Returns an object of customised options for front-end datatables editor:
// parameters:
// params = {
//    vars: the set of wp-localized variables, passed from php (object)
//    action: the wp-ajax action to call for data (string)
//    fields: an array of "field-options" objects defining the fields that the editor will expose. (See https://editor.datatables.net/reference/type/field-options)
//    table: the <div> id of the associated datatable (string - optional; do not include for editors not attached to a table);
//    options: any custom options to add to or override the defaults (object - optional) - see https://editor.datatables.net/reference/option/)
//    template: the <div> id of the template to use for the editor (string - optional); - see https://editor.datatables.net/reference/option/template
// }
function getEditorOptions(params){

  var options = {
    ajax: {
      url: params.vars.ajax_url,
      data: {
        action: params.action,
        secure: params.vars.nonce
      }
    },
    fields: params.fields
  }

  //if a linked table is specified in params, add it to the options object:
  if(params.hasOwnProperty("table")){
    options.table = "#"+params.table;
  }

  //if a linked template is specified in params, add it to the options object:
  if(params.hasOwnProperty("template")){
    options.template = "#"+params.template;
  }

  return options;
}

// *** DT EDITOR INIT *** 
// Function that runs some custom code for all datatables editors created.
// Includes:
//    Setup all select functions with the "Select2" library
//    Recode the datatables "action" so it doesn't conflict with wordpress wp-ajax actions.
function dt_editor_init(editor) {
  
  //when the editor is displayed, initialise all select inputs as select2.
  editor.on('open displayOrder',function(e,mode,action){
    jQuery('.DTE_Body_Content select')
      .select2({
        width: "85%"
      });
  })

  //add the pre-submit function to save the datatables "action" to "dt_action".
  //This is because wordpress overwrites the "action" for its own wp-ajax functions.
  editor.on('preSubmit',function(e,data,action){
      data.dt_action = action
  })
}



//////////////////////////////////////////////////////////////////////////
// ***** DATATABLES HELPER FUNCTIONS **** //
//////////////////////////////////////////////////////////////////////////

// *** Render Multi Cells *** //
//  The function renders each item within a span of class "badge" (Bootstrap 4.0)
//  If the text includes a "/", it is split to render on 2 lines (this prevents overly-long strings forcing the width of the column up)
function renderMultiCells(data,variableName){
        string = "";
        for(var i=0;i<data.length; i++){
          if(data[i][variableName].search("/") == -1) {
            string += "<span class='badge badge-info'>" + data[i][variableName] + "</span>";
          } //endif
          else {
            partstring = data[i][variableName].split("/");
            string += "<span class='badge badge-info'>";
            for(var j=0;j<partstring.length;j++){
              if(j!=0){
                string+="/<br/>";
              }
              string+= partstring[j];
            }
            string+= "</span>";
            
            } //endelse
           
          } //endfor
          return string;
} //end renderMultiCells


// *** CREATE FILTER OBJ *** //
// This function is used to create an object suitable for 'yadcf' to use as the 'data' for a filter.
// parameters: 
//    data: data returned from an ajax call to a dt_editor server-side script.
//    object: name of the top-level variable within data to look inside;
//    variable: the variable name from within 'object' to return (terrible naming structure, I know. See the array.push structure below.)
//
// The function returns an array containing all "variable" strings from the "object" within "data".
function createFilterObj(data,object,variable){
  array = [];
  for(var i=0;i<data.length;i++){
    //console.log(data[i]);
    array.push(data[i][object][variable]);
  }
  return array;
}

// *** INITIALISE FILTERS *** //
// This function sets up datatables filters with the yadcf js library (https://github.com/vedmack/yadcf)
//
// Note to self - needs checking and streamlining **********
function newFilters(filters,datatable,vars){
  console.log("newFilters",filters);

  var promises = [];
  var filterData = {};

  //iterate through each filter and see if an ajax call to the database is needed;
  filters.forEach(function(filter,index){

    //if filter.data exists, then we should go get the data;
    if(filter.data){

      //create a promise in the form of an ajax call
      //
      console.log("filter get action = ",filter.data.action);
      console.log("filter get vars = ",vars);
      promise = jQuery.ajax({
        url: vars.ajax_url,
        data: {
          //use the wp-ajax action passed with the data object:
          action: filter.data.action,
          secure: vars.nonce
        }
      })
      .then(
        function(data){
          //data is what comes back from the ajax call:
          data = JSON.parse(data);

          //save the returned data into filterData, using the column_number as the key.
          filterData[filter.column_number] = data.data;
          console.log(data.data)
          return data.data;
        },
        function(error){
          console.log("error getting filter data",error);
        }
      );
      //push the promise into the promises array, so we know later what we're waiting for
      promises.push(promise);
    }
  })

  jQuery.when.apply(jQuery,promises).then(
    function(schemas){

      //instead of mucking around with the arguments array and trying to match up the arrays to the calls, just used the filterData (which will be complete by now);
      
      //note - filterData will have a bunch of "empty" slots, unless there is a filter defined for every column number.

      console.log("filter data = ",filterData);

      //setup empty yadcf array for filling:
      yadcfArray = [];

      //go through each filter and setup the object:
      filters.forEach(function(filter,ind){
        obj = {
          column_number: filter.column_number,
          filter_container_id: filter.filter_container_id,
          filter_type: "multi_select",
          select_type: "select2",
          style_class: "filter",
          select_type_options:{
            allowClear: true
          },
          filter_default_label:"Select " + filter.label,
          filter_reset_button_text: false
        } // end obj.

        if(filterData[filter.column_number]){
          console.log("filterdata[columnnumber] = " , filterData[filter.column_number]);
          console.log("ind = ",ind);
          console.log("table = ",  filter.data.table);
          console.log("variable = " ,filter.data.variable);
          filterObj = createFilterObj(filterData[filter.column_number],filter.data.table,filter.data.variable);
          obj.data = filterObj;
        }

        yadcfArray.push(obj);
      })

        yadcf.init(datatable,yadcfArray);


      // Object.keys(filterData).forEach(function(key) {
      //   console.log("key = ",key);
      //   console.log("fdata = ",filterData[key]);
      // });

      

    },

    function(error){
      console.log("error getting data for filters",error);
    }
  )


} //end newFilters function


//////////////////////////////////////////////////////////////////////////
// ***** MUSTACHE AND GENERIC DATA CALLS **** //
//////////////////////////////////////////////////////////////////////////

// Ajax function written to work with the WordPress way of doing ajax. Secured with Nonce.
// Will (almost) always return a success, because the wordpress ajax call will work even if the **real** call function beneath it fails.
// vars = localized variables;
// action = wordpress ajax action (which function to call);
// id = id of individual record to return. Leave null if you want all records.
function getData(vars,action,data={}){
  
  data.action = action;
  data.secure = vars.nonce;

  //returns a jqxhr object, which can be extended with .done() .fail() and .always() callbacks.
  return jQuery.ajax({
    url: vars.ajax_url,
    dataType: 'json',
    data: data
  })
}


// *** GET MUSTACHE *** 
// Function that sends an ajax request to get a mustache template for rendering. 
// Returns a jqxhr object, which can be extended with .done() .fail() and .always() callbacks, or strung together with other promises with a $.when() function.
function getMustache(vars,template) {

  return jQuery.ajax({
    url: vars.mustache_url + "/" + template + ".mustache",
  })

}

// *** RENDER MUSTACHE ***
// Function to render a mustache with some data.
// Takes a parameters object:
// params = {
//  data_res: result from a getData() call to a DataTables function to get data,
//  data: a data object
//  tempate_res: result from a getMustache() call to get the template
//  template: the template;
//  main_var: the variable name of the "primary" data object. This will be the main table, to which the other data objects must be made children. (When using MJoin, DataTables returns the primary table data at the same level as the joined data levels, which doesn't work for Mustaches).
// }
// Note - function requires EITHER data or data_res (data beats data_res) and either template or template_res (template beats template_res);
// NOTE - could be extended to accept data and templates without the baggage of the "res" as data and temlpate parameters; then it can figure out whether the data_res or the data wins... 
// NOTE - should probable explain the "main_var" and structures better...
function renderMustache(params){

  //check that the params has the required properties:
  if(!params.hasOwnProperty("data_res") && !params.hasOwnProperty("data"))  {
    console.log("please specify the data_res object or some actual data");
return ({"err": "please specify the data_res object or some actual data"});
;
  }

  //check that the params has the required properties:
  if(!params.hasOwnProperty("template_res") && !params.hasOwnProperty("template"))  {
    console.log("please specify the template_res object or an actual template");
return ({"err": "please specify the template_res object or an actual template"});
;
  }

  //check that the params has the required properties:
  if(!params.hasOwnProperty("target")){
    console.log("please specify the target for the mustache (an id of an html element to put the rendered tempate into");
return ({"err": "please specify the target for the mustache (an id of an html element to put the rendered tempate into"});
;
  }

  // setup data and templates based on what's given in the params:
  if(params.hasOwnProperty("data")){
    var data = params.data;
  }
  if(params.hasOwnProperty("data_res")){
    var data = params.data_res[0].data;
  }
  
  if(params.hasOwnProperty("template")){
    var template = params.template;
  }

  if(params.hasOwnProperty("template_res")){
    var template = params.template_res[0];
  }
  
  //
  console.log("rendering mustache with template",template);
  console.log("rendering mustache with data",data);

  //check for a main_var;
  if(params.hasOwnProperty("main_var")){

    //create a new array to push items to:
    var finalData = [];


    //go through each item in the data array:
    data.forEach(function(item, index){
      //the item is one data object - i.e. 1 row from the main table plus all the associated linked table rows;
      
      //put main table data into the tempGroup root;
      var tempGroup = item[params.main_var];

      //then, go through each other item within the item and put it into the tempGroup;
      Object.keys(item).forEach(function(key) {

        //skip the main_var object, as that's already sorted;
        if(key != params.main_var){
          tempGroup[key] = item[key];
        }
      });

      //finally, push tempGroup to the finalData[] array:
      finalData.push(tempGroup);
    })

  }

  var renderingData = {};
  renderingData[params.main_var] = finalData;

  console.log("renderingData = ",renderingData);

  //take the main_var and render the template using the finalData:
  rendered = Mustache.render(template,renderingData);


  return rendered;
}


//////////////////////////////////////////////////////////////////////////
// ***** OTHER HELPER FUNCTIONS **** //
//////////////////////////////////////////////////////////////////////////



// *** Date to string ***
// A custom function to return a date in string format.
// Takes 2 parameters: 
//  - date: a JS Date Object, e.g. date = new Date();
//  - type: a string which should be one of the following:
//    - "year" (tells function to return just the year as a string;
//    - "month" (will return yyyy-mm )
//    - "day" (will return yyyy-mm-dd )
//    - "datetime" (will return yyyy-mm-ddThh.mm.ss - i.e. the full ISO string just with the miliseconds removed)
//  if Type is anything else, the function will return the full date.toISOString(); 
function date_iso(date,type="") {


  string = date.toISOString();

  if(type=="day"){
    string = string.substr(0,10)
  }

  if(type=="datetime"){
    string = string.substr(0,19)
  }
  // string = string.substr(0,10);

  return string;
}


// *** USER ALERT ***
// A generic function to generate and render a Bootstrap "alert" dismissable box to the page;
// Takes 3 parameters:
//    - text (string) - the text to display;
//    - type (string) - the type of Bootstrap "alert" (success, info, warning, danger, etc); 
//    - target (string) - the <div> id of the html element to append the alert to.
function user_alert(text,type,target){

  alert = "<div class='alert alert-"+type+" alert-dismissible fade show' role = 'alert'>";

  //"DANGER" is a bit harsh to display as a word. Downgrading to error.
  if(type=="danger") {type="error"};

  alert +="<strong>"+title(type)+":  </strong>";
  alert +=text;
  alert += "<button type='button' class='close' data-dismiss='alert' aria-label='Close'>";
  alert += "<span aria-hidden='true'>&times;</span>";
  alert += "</button></div>";

  jQuery('#alert-space').append(alert);

}

// *** Make text Title Case ***
// Returns whatever string is passed to it, But Changed To Title Case;
// NOTE - not "proper" title case, as it doesn't recognise the default set of words that should not be capitalised (and, if, etc...).
function title(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}



// *** ALPHABET SORT ***
// Function to sort an array by a particular string property.
// Returns the array sorted alphabetically (a - z);
function alphabetSort(array,sort_var){
  

  array.sort(function(a,b){
    if(a[sort_var] < b[sort_var]) return -1;
    if(a[sort_var] > b[sort_var]) return 1;
    return 0;
  })

  return array;
}

// *** NUMERIC SORT ***
// Function to sort an array by a numeric property
// Returns the array sorted by number (asc)
function numericSort(array,sort_var){

    array.sort(function(a,b){return a[sort_var] > b[sort_var]})

}

// *** Generic Error
// Function to render a generic error to the user;
// NOTE - needs generalising so the error can be rendered in different places; currently works on the xls-form page;
function genericError(err){
  console.log(err);
  user_alert("Error during one of the request calls - " + err,"danger","alert-space");
}

// **** Working text
//shows "working" process feedback to user inside #working-space div. If text=false, removes all text from #working-space.
function working(text=false){
  if(text){
    jQuery('#working-space').removeClass('hidden').append(" - " + text + " ... ");
    jQuery('.submit_button').prop('disabled','disabled');
  }

  else{
    jQuery('#working-space').addClass('hidden').html("<div class='loader' id='loading'></div> ");
    jQuery('.submit_button').prop('disabled',false);

  }
}

//////////////////////////////////////////////////////////////////////////
// ***** CSV Export **** //
//////////////////////////////////////////////////////////////////////////


// Functions taken from https://gist.github.com/dannypule/48418b4cd8223104c6c92e3016fc0f61#file-json_to_csv-js
// 
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

// *** DataTables Array data to Chart data ***
// Takes an array of objects (e.g. from using table.data().toArray() on a dataTables object) and turns it into something suitable for a c3 chart
// parameters:
//  - dtData - the array of objects to convert
//  - x - the data object property name for the x-axis
//  - y - the data object property name for the y-axis

function dtToChart(data,x,y){

  return data.map(function(item,index){
    xValue = item[x];
    yValue = item[y];

    object = [xValue,yValue];
    return object;
  })


}

function numberWithCommas(x){
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



