var editorDistrict;
var editorCommunity;
jQuery(document).ready(function($){
	console.log("stats4sd-js Starting again");

  //setup editor for Districts
  editorDistrict = new $.fn.dataTable.Editor( {
        ajax: vars.editorurl + "/districts.php",
        display: 'bootstrap',
        table: "#districtTable",
        fields: [
              {
                label: "Project:",
                info: "For test projects, select Research Methods or Soils",
                name: "districts.project",
                type: "select",
                placeholder: "select project"
            },
            {
                label: "District_Code:",
                name: "districts.district_code"
            }, {
                label: "District Label:",
                name: "districts.district_label"
            }, {
                label: "Country:",
                name: "districts.country_id",
                type: "select",
                placeholder: "Select a Country"
            }
        ]
    } );

  //setup editor for Communities
  editorCommunity = new $.fn.dataTable.Editor( {
        ajax: vars.editorurl + "/communities.php",
        display: 'bootstrap',
        table: "#communityTable",
        fields: [
                      {
                label: "Project:",
                info: "For test projects, select Research Methods or Soils",
                name: "communities.project",
                type: "select",
                placeholder: "select project"
            },


            {
                label: "Community_code:",
                name: "communities.community_code"
            }, {
                label: "Community Label:",
                name: "communities.community_label"
            }, 
            {
                label: "District:",
                name: "communities.district_id",
                type: "select",
                placeholder: "Select a District"
            }
        ]
    } );

  // Handle SQL error generated when a duplicate community code is spotted: 
  
  editorDistrict.on('postSubmit', function ( e, json, data, action) {
    console.log('submitted post');
    if(json.error) {
        console.log('sql error noticed');
          var codeField = this.field('district.district_code');
          console.log(json)
          var sqlDupKey = json.error;
          console.log("sqlerror = ", sqlDupKey)

          //if error is for a duplicate Community Code, display error: 
          if(sqlDupKey.includes("SQLSTATE[23000]") && sqlDupKey.includes("district_code")) {
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
        var codeField = this.field('communities.community_code');
        console.log(json)
        var sqlDupKey = json.error;
        console.log("sqlerror = ", sqlDupKey)

        //if error is for a duplicate Community Code, display error: 
        if(sqlDupKey.includes("SQLSTATE[23000]") && sqlDupKey.includes("community_code")) {
          codeField.error('This Code already exists in the database. Please choose a different code');
          //hide default display of error code. 
          json.error = 'Errors have been spotted in the data. Please see the highlighted fields above';
        }
      }
  })

    var communityTable = $('#communityTable').DataTable({
      dom: "Bfrtip",
      ajax: vars.editorurl + "/communities.php",
      columns: [
        { data: "id", title: "More Info", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='barcodeButton_" + data + "'></span>";
         }, "className":"trPlus"},
        { data: "communities.community_code", title: "Code" },
        { data: "communities.community_label", title: "Community Name" },
        { data: "districts.district_label", title: "District Label" },
        { data: "wp_bp_groups.name", title: "Project" }

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
         }, "className":"trPlus"},
        { data: "districts.district_code", title: "District Code" },
        { data: "districts.district_label", title: "District Name" },
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

        $('#communityTable tbody').on('click', 'td.trPlus', function () {
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
                    row.child(initialChildRow(row.data())).show();
                    commChildRow(row.data());
                }
                tr.addClass('shown');
            }
        } );


  }); //end document ready

function initialChildRow(data){
  return "<div id='child-row-" + data.communities.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}

function commChildRow(data) {
  console.log("commChildRow!!")
  //send community ID off to an Ajax call.
  //get community ID:
  var rowData = data;
  console.log(rowData);
  community_id = rowData.communities.id;
  community_name = rowData.communities.community_label;
  country_name = rowData.countries.country_label;
  console.log(community_id);
  //The ajax call should query the database and return:
  // - all the barcodes created for this community
  // - the status of each barcode (created? printed? used?)
  //
   $.ajax({
      url: vars.ajaxurl,  // request url, from the php script.
      "type": 'POST',
      "dataType":"json",
      "data": {
        "action": 'get_barcodes',
        "nonce": vars.pa_nonce,
        "community_id": community_id
      }, //end data;

      success: function(response) {
        res = JSON.parse(response.data);
        console.log(res);
        var countUsed = 0;
        var countPrinted = 0;
        var countCoded = 0;
        if(res != 0) {
          //if there are some barcodes generated;
          //count any barcodes that are in use;
          for(var x=0; x<res.length;x++){
            if(res[x].status=="coded") { countCoded++;}
            if(res[x].status=="printed") {countPrinted++;}
            if(res[x].status=="used") {countUsed++;}
          }
        }
        countCodes =
          "<table class='table table-striped'>"+
          "<tr><td>Number of Generated and Unprinted Barcodes:</td><td>"+countCoded+"</td></tr>"+
          "<tr><td>Number of Printed Barcodes:</td><td>"+countPrinted+"</td></tr>"+
          "<tr><td>Number of Barcodes assigned to samples:</td><td>"+countUsed+"</td></tr>"+
          "</table>";


        newButton = "<button id='newCodes-"+community_id+"' class='btn btn-primary'>Create New Code</button>";
        printButton = "<button id='printCodes-"+community_id+"' class='btn btn-primary' data-toggle='modal' data-target='#printCodesModal-"+community_id+"'>Print Codes</button>";
        
        //setup the print modal;
        printModal = '<div class="modal fade" id="printCodesModal-'+community_id+'">'+
          '<div class="modal-dialog" role="document" id="">'+
'            <div class="modal-content">'+
'              <div class="modal-header">'+
'                <h5 class="modal-title">Soil Sample QR Codes for Community ID = '+community_id+'</h5>'+
'                <button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
'                  <span aria-hidden="true">&times;</span>'+
'                </button>'+
'              </div>'+
'              <div class="modal-body" id="printCodesModalBody-'+community_id+'">';
          for(var y=0; y<res.length;y++){
            if(res[y].status!="printed") {
              printModal += "<div style='padding:28px;display:inline-block;'><img src='"+res[y].url+"'></img><p style='text-align:center;'>"+res[y].code+"</p></div>";
              }
          }
        printModal += '</div>'+
'              <div class="modal-footer">'+
'                <button type="button" class="btn btn-primary" id="buttonPrint-'+community_id+'">Print</button>'+
'                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'+
'              </div>'+
'            </div>'+
'          </div>'+
'        </div>';
        $('#child-row-'+community_id).html(countCodes + newButton + printButton + printModal);

        //setup new code generation
        console.log("comm",community_id);
        $('#newCodes-'+community_id).click(function(){
          //when newCodes button is clicked, generate  new codes:
          $.ajax({
            url: vars.ajaxurl,
            "type":'POST',
            "dataType":"json",
            "data":{
              "action": 'create_barcode',
              "nonce": vars.pa_nonce,
              "value": community_id
            },
            success: function(response) {
              ress = response.data;
              console.log("create_barcode response",ress);
              commChildRow(rowData);
              // $('#child-row-'+community_id).append("<div>new barcode: <img src='"+data+"'></img></div>");
            }
          });
        }); //end newCodes click

        //setup print function
        $('#buttonPrint-'+community_id).click(function(){
          printJS({
            printable: 'printCodesModalBody-'+community_id,
            type: "html",
            header: "Soil Sample Codes for Community: " + community_name + ", in " + country_name + "."
          });
          //then, whether the final printout is compelted or not, mark all bardodes as "printed".
          $.ajax({
            url: vars.ajaxurl,
            "type":"post",
            "dataType":"json",
            "data":{
              "action":"update_barcodes",
              "nonce": vars.pa_nonce,
              "value": community_id
            },
            success: function(response){
              resss = response.data;
              console.log("update barcodes successful with response",resss);
              //update display to render the new count of printed barcodes.
              commChildRow(rowData);
            }
          });
        });

        
      }

    });

}

function commChildRow(data) {
  //get barode to display:
  console.log(data.samples.id)
          $.ajax({
            url: vars.ajaxurl,
            "type":'POST',
            "dataType":"json",
            "data":{
              "action": 'get_single_barcode',
              "nonce": vars.pa_nonce,
              "value": data.samples.id
            },
            success: function(response) {
              ress = response.data;
              console.log("create_barcode response",ress);
              $('#child-row-'+data.samples.id).html("<img src="+ress+"></img>");
              // $('#child-row-'+community_id).append("<div>new barcode: <img src='"+data+"'></img></div>");
            },
            error: function(response){
              $('#child-row-'+data.samples.id).html("error");
            }
          });
  }