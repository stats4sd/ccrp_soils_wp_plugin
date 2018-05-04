var editor;

jQuery(document).ready(function($){
  console.log("stats4sd-js soils Starting again");

  console.log("current user", vars.user_groups);

  //Setup datatables columns:
  var soilsColumns = [
    { data: "samples.id", title: "Show barcode", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='barcodeButton_" + data + "'></span>";
         }, "className":"trPlus"},
    {data: "samples.id", title: "sample ID"},
    {data: "samples.sampling_date", title: "samples.sampling_date" },
    {data: "samples.collector_name", title: "samples.collector_name" },
    {data: "samples.sampling_depth", title: "samples.sampling_depth" },
    {data: "samples.sample_comments", title: "samples.sample_comments" },
    // {data: "samples.plot_id", title: "samples.plot_id", className:"plot", visible:false },
    // {data: "plots.plot_name", title: "plots.plot_name", className:"plot", visible:false },
    // {data: "plots.plot_gradient", title: "plots.plot_gradient", className:"plot", visible:false },
    // {data: "plots.soil_texture", title: "plots.soil_texture", className:"plot", visible:false },
    // {data: "plots.farmer_kn_soil", title: "plots.farmer_kn_soil", className:"plot", visible:false },
    // {data: "plots.latitude", title: "plots.latitude", className:"plot", visible:false },
    // {data: "plots.longitude", title: "plots.longitude", className:"plot", visible:false },
    // {data: "plots.altitude", title: "plots.altitude", className:"plot", visible:false },
    // {data: "plots.accuracy", title: "plots.accuracy", className:"plot", visible:false },
    {data: "analysis_poxc", title: "Analysis POXC: analysis_date", render: "[,].analysis_date", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: colorimeter", render: "[,].colorimeter", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: colorimeter_100", render: "[,].colorimeter_100", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: colorimeter_calc", render: "[,].colorimeter_calc", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: comment_cloudy", render: "[,].comment_cloudy", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: conc_digest", render: "[,].conc_digest", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: id", render: "[,].id", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: moisture_corrected", render: "[,].moisture_corrected", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: photo", render: "[,].photo", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: poxc_corrected_moisture", render: "[,].poxc_corrected_moisture", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: poxc_insample", render: "[,].poxc_insample", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: poxc_insoil", render: "[,].poxc_insoil", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: raw_conc_extract", render: "[,].raw_conc_extract", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: soil_moisture", render: "[,].soil_moisture", className:"poxc", visible: false},
    {data: "analysis_poxc", title: "Analysis POXC: weight_soil", render: "[,].weight_soil", className:"poxc", visible: false},
    {data: "analysis_ph", title:"analysis_ph: comment_ph_stability", render:"[,].comment_ph_stability", className:"ph", visible: false},
    {data: "analysis_ph", title:"analysis_ph: ph", render:"[,].ph", className:"ph", visible: false},
    {data: "analysis_ph", title:"analysis_ph: volume_water", render:"[,].volume_water", className:"ph", visible: false},
    {data: "analysis_ph", title:"analysis_ph: weight_soil", render:"[,].weight_soil", className:"ph", visible: false},
    {data: "analysis_ph", title:"analysis_ph: analysis_date", render:"[,].analysis_date", className:"ph", visible: false},
    {data: "analysis_p", title:"analysis_p: analysis_date", render:"[,].analysis_date", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: colorimeter", render:"[,].colorimeter", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: colorimeter_100", render:"[,].colorimeter_100", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: comment_cloudy_solution", render:"[,].comment_cloudy_solution", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: raw_conc_extract", render:"[,].raw_conc_extract", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: id", render:"[,].id", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: soil_conc_olsen", render:"[,].soil_conc_olsen", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: volumne_filtered_extract", render:"[,].volumne_filtered_extract", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: volumne_topup", render:"[,].volumne_topup", className:"p", visible: false},
    {data: "analysis_p", title:"analysis_p: weight_soil", render:"[,].weight_soil", className:"p", visible: false}
  ];

  //datatables parameters
  soilsTableParams = {
    vars: vars,
    action: "dt_soils",
    target: "DataTable",
    columns: soilsColumns,
    options: {
      dom: "Bfrtip",
      buttons: [
      {
        extend: 'collection',
        text: 'show/hide columns',
        buttons:    [
        {
          extend: 'columnToggle',
          text: "Plot Information",
          columns: ".plot"
        },
        {
          extend: 'columnToggle',
          text: "Analysis POXC",
          columns: ".poxc"
        },
        {
          extend: 'columnToggle',
          text: "Analysis P",
          columns: ".p"
        },
        {
          extend: 'columnToggle',
          text: "Analysis ph",
          columns: ".ph"
        },
        ]
      },
      {
        extend: 'csv',
        text: "download sample data in csv format"
      }
    ]
    }
    
  };

  //call datatables function
  var soils_table = newDatatable(soilsTableParams);


  //setup child row (that shows sample barcode)
  $('#DataTable tbody').on('click', 'td.trPlus', function () {
      console.log("clicked");
      var tr = $(this).parents('tr');
      var row = soils_table.row( tr );
      console.log(row);
      if ( row.child.isShown() ) {
          // This row is already open - close it
          row.child.hide();
          tr.removeClass('shown');
      }
      else {
          //if there is a child row, open it.
          if(row.child() && row.child().length)
          {
              row.child.show();
          }
          else {
              //else, format it then show it.
              row.child(initialChildRow(row.data())).show();
              commChildRow(row.data());
          }
          tr.addClass('shown');
      }
  } );

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

  //hidden projectforms table, just for syncing kobo data (getting the kobo_form_ids)
  var projectFormsColumns = [
    {data: "project_forms_info.id", title: "ID", visible: false},
    {data: "project_forms_info.project_id", title: "Project ID", visible: false},
    {data: "project_forms_info.project_kobotools_account", title: "Project Name", visible: false},
    {data: "project_forms_info.form_id", title: "Form ID", visible: false},
    {data: "project_forms_info.form_kobo_id", title: "Kobotools Form ID", visible: true},
    {data: "project_forms_info.count_records", title: "Record Count", visible: true}

  ];

  //datatables parameters
  projectFormsParams = {
    vars: vars,
    action: "dt_project_forms",
    target: "projects_table",
    columns: projectFormsColumns,
    options: {
      buttons: [
      {
          text: "Update records",
          action: function(e,dt,node,config){
            update_counts(dt);
          }
        },
      ],
    },
      buttons_target: "update_records_button"
    }

  //call datatables function
  projectFormsTable = newDatatable(projectFormsParams);


}); //end doc ready;

//function to render a 'loading' temporary child row while QR code generates
// // probaby not needed any more, as initially the QR code was generated server-side but is now done in browser JS.
function initialChildRow(data){
  return "<div id='child-row-" + data.samples.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}

//function to generate the QR code and render it into a child-row.
function commChildRow(data) {
  //get barode to display:
  console.log(data.samples.id)

  $('#child-row-'+data.samples.id).html("<div id='qr_"+ data.samples.id +"'></div>");


  new QRCode(document.getElementById('qr_'+data.samples.id),{
        text: data.samples.id,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });


  }


/*************** COPIED FROM NRC *********************/

function update_counts(dt){
  //get list of forms for current view
  console.log("checking Kobotoolbox for new submissions");
  console.log(dt.column(0).data());

  forms = dt.data().toArray();


  var requests = [];

  //for Each formId, setup request, then push to promises;
  forms.forEach(function(form,index){
    formId = form.project_forms_info.form_kobo_id;

    console.log(index,formId);
      // return false;


    existingIds = form.project_forms_info.count_records;

    if(formId != null) {

      request = requestFormCount(formId);
      requests.push(request);

      request.done(function(response){
        
        if(response.statusCode != 200) {
          throw("warning - unable to reach Kobotoolbox site to retrieve new data. Please check that the Kobotoolbox site is currently accessible through the browser");
        }
        formCountResponse(response,form,existingIds)
      });
    }


  });


  jQuery.when.apply(jQuery,requests).then(function(responses){
    console.log();
    user_alert("All forms in current view checked and syncronised","info","alert-space");
  })
}

function requestFormCount(formId) {
  request = jQuery.ajax({
    url: vars.node_url + "/countRecords",
    method: "POST",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      kobo_id: formId
    })
  })

  return request;
}

function formCountResponse(response,form,existing_ids){
  db_count = form.project_forms_info.count_records
  console.log("db count = ",db_count)
  if(db_count == null){
    db_count = 0;
  }
  console.log("function response for",response);
  //check count against count:
  if(db_count == response.count){
    console.log("kobo_form with id" + response.kobo_id + " has same number of records as database")
    return;
  }

  if(db_count > response.count){
    console.log("kobo_form with id" + response.kobo_id + "has fewer records than database")
    return;
  }

  if(db_count < response.count){
    console.log("kobo_form with id" + response.kobo_id + " has more records - starting to pull them");
    console.log("existing Ids = ",existing_ids);


    pullRequest = jQuery.ajax({
      url: vars.node_url + "/pullData",
      method: "POST",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({
        kobo_ids: [response.kobo_id],
        existing_ids: existing_ids
      })
    })

    pullRequest.done(function(response){
      console.log("data pulled");
      //add pulled data to collected_data table:
      response = response.body;
      console.log("response, ",response);

      savedata = {};
      response.forEach(function(row,index){
        

        //insert functions from original node JS to parse into main tables:
        parse_data_into_tables(row,form);


        record = JSON.stringify(row);
        
        //remove / from keys:
        record = record.replace(/\//g,"_");
        //console.log("record:",record)
        savedata[index] = {};
        savedata[index]["DT_RowId"] = index;
        savedata[index]["xls_form_submissions"] = {
          form_kobo_id: row._form_kobo_id,
          record_data: record,
          uuid: row._uuid
        }
      })

      console.log("would save",savedata);
      //forms_table.ajax.reload().draw()

      jQuery.ajax({
        url: vars.ajax_url,
        dataType: "json",
        method:"POST",
        data:{
          action:"dt_xls_form_submissions",
          secure:vars.nonce,
          dt_action:"create",
          data: savedata
        }
      })
      .done(function(response){
        console.log("response from db: ",response);
      })

    })
    console.log();
    user_alert("New records successfully pulled from Kobo","success","alert-space");
    return;
  }
}


function parse_data_into_tables(data,form){
  console.log("form here is",form);
  formType = form.xls_forms.form_id;
  projectId = form.project_forms_info.project_id
  

  //work out which form type it is...
  if(formType == "ccrp_soil_intake"){
    // add inserts for community; farmer; plot etc...


    // *****************************************************
    // Insert Samples
    // *****************************************************
    var sampleValues = {};


    //for each sample within this plot...
    for (var y = 0; y < data['sample_info'].length; y++) {
      //wrap inside self-serving function to avoid async issues with x and ys ...
      console.log("sample ID = ",data['sample_info'][y]['sample_info/sample_id']);
      console.log("farmer ID = ",data['farm_id']);
        (function(y) {
          sampleValues[y] = {};
          sampleValues[y]["Dt_RowId"] = y;
          sampleValues[y]["samples"] = {
            id: data['sample_info'][y]['sample_info/sample_id'],
            farmer_id: data['farm_id'],
            //plot_name: data['plot_name'],
            //plot_gradient: data['plot_gradient'],
            //farmer_kn_soil: data['farmer_knowledge_soil_type'],
            soil_texture: data['sample_info'][y]['sample_info/soil_texture'],
            sampling_date: data['sample_info'][y]['sample_info/sampling_date'],
            sampling_depth: data['sample_info'][y]['sample_info/sampling_depth'],
            sample_comments: data['sample_info'][y]['sample_info/sample_comments'],
            collector_name: data['_submitted_by'],
            project_id: projectId
          }
       })(y); //end function(y);
    } //end for loop to go around the samples

    //insert Sample values into Db via editor ajax function:
    jQuery.ajax({
      url: vars.ajax_url,
      dataType: "json",
      method:"POST",
      data:{
        action:"dt_samples",
        secure:vars.nonce,
        dt_action:"create",
        data: sampleValues
      }
    })
    .done(function(response){
      console.log("response from inserting samples to db: ",response);
    })



  } 

  if(formType == "ccrp_soil_p") {
    p = {};
    p[0] = {};
    p[0]["Dt_RowId"] = 0;
    p[0]["analysis_p"] = {
      sample_id: data['sample_id'],
      analysis_date: data['today'],
      weight_soil: data['Weight_soil_in'],
      volume_filtered_extract: data['Volume_filtered_extract'],
      volume_topup: data['Volume_topup'],
      colorimeter_100: data['Reading_100percent'],
      colorimeter: data['Reading_Colorimeter'],
      comment_cloudy_solution: data['Comment_Cloudy_solution'],
      raw_conc_extract: data['Raw_conc_extract'],
      soil_conc_olsen: data['Soil_conc_Olsen_P']
    }

    console.log("final p",p);

    jQuery.ajax({
      url: vars.ajax_url,
      dataType: "json",
      method:"POST",
      data:{
        action:"dt_analysis_p",
        secure:vars.nonce,
        dt_action:"create",
        data: p
      }
    })
    .done(function(response){
      console.log("response from inserting p to db: ",response);
    })

  }

    if(formType == "ccrp_soil_ph") {
    ph = {};
    ph[0] = {};
    ph[0]["Dt_RowId"] = 0;
    ph[0]["analysis_ph"] = {
      sample_id: data['sample_id'],
      analysis_date: data['today'],
      weight_soil: data['Weight_soil_in'],
      volume_water: data['Volume_water_used'],
      ph: data['Reading_pH_meter'],
      comment_ph_stability: data['Comment_pH_stability'],
    }

    jQuery.ajax({
      url: vars.ajax_url,
      dataType: "json",
      method:"POST",
      data:{
        action:"dt_analysis_ph",
        secure:vars.nonce,
        dt_action:"create",
        data: ph
      }
    })
    .done(function(response){
      console.log("response from inserting ph to db: ",response);
    })

  }

    if(formType == "ccrp_soil_poxc") {
    poxc = {};
    poxc[0] = {};

    if(data.hasOwnProperty('estimated_soilmoisture')){
        if(data.estimated_soilmoisture != null && data.estimated_soilmoisture != 0 && data.estimated_soilmoisture != "") {
            soil_moisture = data.estimated_soilmoisture;
        }
        else {
            soil_moisture = 0;
        }
    }
    else {
        soil_moisture = 0;
    }

    poxc[0]["Dt_RowId"] = 0;
    poxc[0]["analysis_poxc"] = {
      sample_id: data['sample_id'],
      analysis_date: data['today'],
      weight_soil: data['Weight_soil_in'],
      colorimeter: data['Reading_Colorimeter'],
      colorimeter_100: data['Reading_100percent'],
      conc_digest: data['conc_digest_solution'],
      comment_cloudy: data['Comment_Cloudy_solution'],
      photo: data['Photo_vial'],
      colorimeter_calc: data['colorimeter_calc'],
      raw_conc_extract: data['Raw_conc_extract'],
      poxc_insample: data['mg_POXC_inSample'],
      poxc_insoil: data['mg_kg_Conc_POXC_in_Soil'],
      moisture_corrected: data['correct_for_soilmoisture_yesno'],
      soil_moisture: soil_moisture,
      poxc_corrected_moisture: data['corrected_forMoist_mg_kg_POXC']
    }

    jQuery.ajax({
      url: vars.ajax_url,
      dataType: "json",
      method:"POST",
      data:{
        action:"dt_analysis_poxc",
        secure:vars.nonce,
        dt_action:"create",
        data: poxc
      }
    })
    .done(function(response){
      console.log("response from inserting poxc to db: ",response);
    })

  }
}