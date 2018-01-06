var farmEditor;
jQuery(document).ready(function(){
  console.log("stats4sd-js Starting with farms");

// Setup automatic redraw of datatables when you switch to a new Bootstrap tab 
// (workaround, see https://datatables.net/examples/api/tabs_and_scrolling.html)

jQuery('a[data-toggle="tab"]').on( 'click', function (e) {
    console.log("tab switch noticed");
    jQuery.fn.dataTable.tables({visible:true,api:true}).columns.adjust();
    } );

  //setup editor for DataTables
  farmEditor = new jQuery.fn.dataTable.Editor( {
        ajax: vars.editorurl + "/farms.php",
        table: "#farmTable",
        fields: [
            {
              label: "Project",
              name: "farmers.project",
              
              type: "select",
              placeholder: "Select a project"
            },
            {
                label: "Farmer Code:",
                name: "farmers.farmer_code"
            }, {
                label: "Farmer Name:",
                name: "farmers.farmer_name"
            },
            {
                label: "Community:",
                name: "farmers.community_id",
                type: "select",
                placeholder: "Select a Community"
            }
        ]
    } );

// Setup dependancy for countries and communities
// This is to set the communities field to automatically update when you select a country in the editor form.
 // farmEditor.dependent('communities.country_id',vars.editorurl + "/country_community.php");

    var farmTable = jQuery('#farmTable').DataTable({
      autowidth: true,
      dom: "Bfrtip",
      ajax: vars.editorurl + "/farms.php",
      columns: [
        { data: "id", title: "Show Barcode", render: function(data,type,row,meta){
           return "<span class='fa fa-plus-circle commButton' id='barcodeButton_" + data + "'></span>";
          }, "className":"trPlus"},
        // { data: "id", title: "More Info", render: function(data,type,row,meta){
        //    return "<span class='fa fa-plus-circle commButton' id='barcodeButton_" + data + "'></span>";
        //  }, "className":"trPlus"},
        //  
        { data: "communities.community_code", title: "Community", visible: false },
        // { data: "communities.country_id", title: "Country", visible: false },

        { data: "farmers.farmer_code", title: "Farm / Farmer Code" },
        { data: "farmers.farmer_name", title: "Farm / Farmer Name" },
        // { data: "countries.country_label", title: "Country", visible: false},
        { data: "communities.community_label", title: "Community" },
                { data: "wp_bp_groups.name", title: "Project" }


      ],
      select: true,
      buttons: [
       { extend: "create", editor: farmEditor },
       { extend: "edit",   editor: farmEditor },
       { extend: "remove", editor: farmEditor }
      ],

    });





        //setup child-row activation:
        //
        jQuery('#farmTable tbody').on('click', 'td.trPlus', function () {
            console.log("clicked");
            var tr = jQuery(this).parents('tr');
            var row = farmTable.row( tr );
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

function initialChildRow(data){
  return "<div id='child-row-" + data.farmers.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}

  }); //end document ready
 
function commChildRow(data) {
  //get barode to display:
  code = data.communities.community_code.concat("-").concat(data.farmers.farmer_code);

  // code = data.communities.community_code.concat("_");
  // code = code.concat(data.farmers.farmer_code);
  console.log(code);
          jQuery.ajax({
            url: vars.ajaxurl,
            "type":'POST',
            "dataType":"json",
            "data":{
              "action": 'get_single_barcode',
              "nonce": vars.pa_nonce,
              "value": code
            },
            success: function(response) {
              ress = response.data;
              console.log("create_barcode response",ress);
              jQuery('#child-row-'+data.farmers.id).html("<div class='col-sm-4'><h5 style='text-align:center'>Farm Unique Barcode</h5><img class='img-responsive center-block' src="+ress+"></img><p style='text-align:center;'>"+code+"</p></div>");


              // add button to generate bar codes
              
              jQuery('#child-row-'+data.farmers.id).append("<div class='col-sm-4'><button class='btn btn-default' id='gen_"+data.farmers.id+"'>Generate sample barcodes sheet</button></div>");

              //Generate 9 sample QR codes
              jQuery('#gen_'+data.farmers.id).on('click', function() {
                generateCodes(code,ress);
                });


            },
            error: function(response){
              jQuery('#child-row-'+data.farmers.id).html("error");
            }
          });


  }

      function generateCodes(code,farmerimg){
      console.log("generating Codes for " + code);
      // jQuery.ajax({
      //   url: vars.ajaxurl,
      //   "type":'POST',
      //   "dataType":"json",
      //   "data":{
      //     "action":'get_sample_codes',
      //     "nonce": vars.pa_nonce,
      //     "value": code
      //   },
      //   success: function(response) {
      //     sampleCodesRes = respnse.data;

      //   }
      //   })
        console.log(farmerimg)

          var docDef = {
            styles: {
              header: {
                fontsSize: 22,
                bold: true
              }
            },
            content: [
            {
              columns: [
              {
                width: "50%",
                image: farmerimg.toDataUrl()
              }]
            }]
          }
          
                   
          pdfMake.createPdf(docDef).print();
      }
