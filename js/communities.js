var editorDistrict;
var editorCommunity;
jQuery(document).ready(function($){
	console.log("stats4sd-js Starting again");

  

  //setup editor for Districts
  editorDistrict = new $.fn.dataTable.Editor( {
        ajax: vars.editorurl + "/districts.php",
        table: "#districtTable",
        template: "#district-edit-template",
        //display: "bootstrap",
        fields: [
              {
                label: "Project:",
                info: "For test projects, select Research Methods or Soils",
                name: "districts.project",
                type: "select",
                placeholder: "select project",
            },
            {
                label: "District_ID:",
                name: "districts.id",
                type: "hidden" //this value is generated from concatenating the project-code and the entered string.
            }, 

            {
                label: "District Label:",
                name: "districts.district_label",
            }, {
                label: "Country:",
                name: "districts.country_id",
                type: "select",
                placeholder: "Select a Country",
             }
        ]
    } );

  //setup editor for Communities
  editorCommunity = new $.fn.dataTable.Editor( {
        ajax: vars.editorurl + "/communities.php",
        display: 'bootstrap',
        table: "#communityTable",
        template: "#community-edit-template",
        fields: [
                      {
                label: "Project:",
                labelInfo: "For test projects, select Research Methods or Soils",
                name: "communities.project",
                type: "select",
                placeholder: "select project"
            },

            {
                label: "VBA Code:",
                name: "communities.id",
                type: "hidden"
            }, {
                label: "Community Representative's Name:",
                name: "communities.community_label"
            }, 
            {
                label: "Network:",
                name: "communities.district_id",
                type: "select",
                placeholder: "Select a Network",
            }
        ]
    } );

  // Handle SQL error generated when a duplicate community code is spotted: 
  
  editorDistrict.on('postSubmit', function ( e, json, data, action) {
    console.log('submitted post');
    if(json.error) {
        console.log('sql error noticed');
          var codeField = this.field('district.id');
          console.log(json)
          var sqlDupKey = json.error;
          console.log("sqlerror = ", sqlDupKey)

          //if error is for a duplicate Community Code, display error: 
          if(sqlDupKey.includes("SQLSTATE[23000]") && sqlDupKey.includes("id")) {
            codeField.error('This Code already exists in the database. Please choose a different code');
            //hide default display of error code. 
            json.error = 'Errors have been spotted in the data. Please see the highlighted fields above';
          }
        }
  })

  editorCommunity.on('postSubmit', function ( e, json, data, action) {
    console.log('submitted post');
    if(json.error) {
      console.log('sql error noticed');
        var codeField = this.field('communities.id');
        console.log(json)
        var sqlDupKey = json.error;
        console.log("sqlerror = ", sqlDupKey)

        //if error is for a duplicate Community Code, display error: 
        if(sqlDupKey.includes("SQLSTATE[23000]") && sqlDupKey.includes("id")) {
          codeField.error('This Code already exists in the database. Please choose a different code');
          //hide default display of error code. 
          json.error = 'Errors have been spotted in the data. Please see the highlighted fields above';
        }
      };

      location.reload();
  })

    var communityTable = $('#communityTable').DataTable({
      dom: "Bfrtip",
      ajax: vars.editorurl + "/communities.php",
      columns: [
        { data: "id", title: "More Info", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle' id='commInfo_" + data + "'></span>";
         }, "className":"commButton",visible:true},
        { data: "communities.id", title: "Code" },
        { data: "communities.community_label", title: "Community Representative's Name" },
        { data: "districts.district_label", title: "Network Label" },
        { data: "wp_bp_groups.name", title: "Project" },


      ],
      select: true,
        buttons: [
            { extend: "create", editor: editorCommunity },
            { extend: "edit",   editor: editorCommunity },
            // { extend: "remove", editor: editor }
        ]
    });

    var districtTable = $('#districtTable').DataTable({
      dom: "Bfrtip",
      ajax: vars.editorurl + "/districts.php",
      columns: [
        { data: "id", title: "More Info", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='" + data + "'></span>";
         }, "className":"trPlus",visible:false},
        { data: "districts.id", title: "Network Code" },
        { data: "districts.district_label", title: "Network Name" },
        { data: "countries.country_label", title: "Country Label" },
        { data: "wp_bp_groups.name", title: "Project" },

      ],
      select: true,
        buttons: [
            { extend: "create", editor: editorDistrict },
            { extend: "edit",   editor: editorDistrict },
            // { extend: "remove", editor: editor }
        ]
    });

    yadcf.init(communityTable, [
                    {
            column_number: 3,
            filter_container_id: "community_districtFilter",
            filter_type:"select",
            filter_default_label:"Select District",
            style_class:"form-control filter-control",
            filter_reset_button_text:"Reset"
          },
                              {
            column_number: 4,
            filter_container_id: "community_projectFilter",
            filter_type:"select",
            filter_default_label:"Select Project",
            style_class:"form-control filter-control",
            filter_reset_button_text:"Reset"
          }

    ]);

    yadcf.init(districtTable, [
                    {
            column_number: 4,
            filter_container_id: "district_projectFilter",
            filter_type:"select",
            filter_default_label:"Select Project",
            style_class:"form-control filter-control",
            filter_reset_button_text:"Reset"
          }
          ]);
        //setup child-row activation:

        $('#communityTable tbody').on('click', 'td.commButton', function () {
            console.log("clicked");
            var tr = $(this).parents('tr');
            var row = communityTable.row( tr );
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
                    row.child(initialCommChildRow(row.data())).show();
                    
                    //get data for the row;
                    var rdata = row.data();
                    console.log("row data",rdata);
                    community_label = rdata.communities.community_label;
                    community_id = rdata.communities.id;

                    var farmer_count = rdata.farmers.length;
                    console.log("farmer_count = ",farmer_count);

                    $.get(vars.editorurl + "/community_childrow.mst",function(template){
                      var rendered = Mustache.render(template,{
                        farmer_count: farmer_count,
                        community_id: community_id
                      });
                      row.child(rendered).show();

                      //setup barcode generator button:
                      $("#Commgen_"+community_id).click(function(e){

                          //generate codes
                          $.ajax({
                            url: vars.ajaxurl,
                            "type":"POST",
                            "dataType":"json",
                            "data":{
                              "action":"create_community_barcodes",
                              "nonce":vars.pa_nonce,
                              "farmers":rdata.farmers,
                            },
                            success: function(response){
                              console.log("create_barcode response", response);
                              
                              setupCommCodeSheet(response.data,rdata);

                              // setup_codeSheet(codes);
                            },
                            error: function(jqXHR,textStatus,errorThrown){
                              console.log("ajax error create barcodes",textStatus);
                              console.log(errorThrown);
                            }
                          }); //end jquery ajax
                      }); //end jQuery click
                    }); //end get template
            
                //tr.addClass('shown');
           } //end else
         } // end else
        }); //end on click commbutton 

//setup editor code generation:
//
//// district code:

  editorDistrict.on('open displayOrder', function(e,mode,action){
    $("#DTE_Field_districts-project").change(function(){
      console.log('district project updated');
      console.log('project id = ',$(this).val());
      id = $(this).val();
      temp = [
        "NA","RMS","SOILS","FP"
      ]
      console.log('project code', temp[id]);
      $('#district_code_prefix').html(temp[id]);
    });
  });

editorDistrict.on('initSubmit',function(e,action){
  if(editorDistrict.field('districts.project').val() == '') {
    this.error('Please select a project');
    return false;
  }
  district_code = jQuery('#district_code_prefix').html()
  district_code += jQuery('#district_code_entered').val();
  //
  //*** Districts have an id but no code field. Inconsistency needs to be fixed between tables!!!
  
  editorDistrict.field('districts.id').val(district_code);
  //editorDistrict.field('districts.code').val(district_code);
  console.log('district_code calc',district_code);
  return true;
});

  editorCommunity.on('open displayOrder', function(e,mode,action){
    $("#DTE_Field_communities-district_id").change(function(){
      console.log('district updated');
      console.log('district id = ',$(this).val());
      id = $(this).val();
      $('#community_code_prefix').html(id);
    });
    $("#DTE_Field_communities-project").change(function(){
      var pro = $(this).val();
      temp = [
        "NA","RMS","SOILS","FP"
      ]

      pro = temp[pro]
      console.log(pro)
      $("#DTE_Field_communities-district_id option").each(function() {
        $(this).show();
        val = $(this).val();
        console.log(pro)
        console.log("val = ",val);
        console.log(val.search(pro))
        if(val.search(pro)!=0) {
          if(val!="") {
            $(this).hide();

          }
        }
      }); //end each
    });
  });

editorCommunity.on('initSubmit',function(e,action){
  if(editorCommunity.field('communities.project').val() == '') {
    this.error('Please select a project');
    return false;
  }
  community_code = jQuery('#community_code_prefix').html();
  community_code += jQuery('#community_code_entered').val();
  editorCommunity.field('communities.id').val(community_code);
  
  //THis is a hacky line - shouldn't have the same id and code. ID should either be gone or be an auto-increment number.
  editorCommunity.field('communities.code').val(community_code);


  console.log('community_code calc',community_code);
  return true;
});

  }); //end document ready

function initialCommChildRow(data){
  return "<div id='child-row-" + data.communities.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}

function setupCommCodeSheet(data,rdata){
  //setup sheet for all farms in a community: 
  
  //calculate page break points: 
  
 
  jQuery.get(vars.editorurl + "/multi-farm_samplecodes.mst", function(template){
    var rendered = Mustache.render(template,{
      community_code: rdata.communities.id,
      community_label: rdata.communities.community_label,
      farmers: data
      

    });
    console.log(rendered);

    jQuery('#comm_sample_sheet').html(rendered);
    jQuery('#comm_samplesheetmodal').modal('toggle');

    //page break points:
      
    jQuery(".farmer-block").each(function(index){
      if((index+1) % 2 == 0){
        jQuery(this).addClass('row')
      }
    })
    jQuery('.after-print').each(function(index){
      if((index+1) % 6 == 0) {
        jQuery(this).addClass('break-after');
        console.log('added pageBreak after index',index);
      }
      if((index+2) % 6 == 0) {
        jQuery(this).addClass('break-before');
        console.log("added break-before to index",index);
      }
      console.log('no pagebreak added to index',index);
    });

    //add qr codes: 
    //
    for(i = 0; i<data.length; i++) {

      elementId = "qr_" + data[i].farmer_id;
      farmerId = data[i].farmer_id;

      new QRCode(document.getElementById(elementId),{
        text: farmerId,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });

      sampleElementId = "qr_" + data[i].code;
      sample_code = data[i].code;

      new QRCode(document.getElementById(sampleElementId),{
        text: sample_code,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }

    //setup print button;
    jQuery('#comm_printbutton_'+rdata.communities.id).click(function(){
      console.log('print button clicked');

      jQuery('#comm_print_modal_'+rdata.communities.id).printElement({
        pageTitle:"SampleSheet_"+rdata.communities.community_label+" - "+rdata.communities.id,
      });
      

    });

    // jQuery('#comm_printbutton_'+rdata.communities.id).printPreview({
    //   obj2print:'#comm_print_modal_'+rdata.communities.id,
    //   width: 810
    // });
  });
}
