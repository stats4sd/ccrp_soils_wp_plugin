var editorFarm;
jQuery(document).ready(function(){
  console.log("stats4sd-js Starting with farms");

// Setup automatic redraw of datatables when you switch to a new Bootstrap tab
// (workaround, see https://datatables.net/examples/api/tabs_and_scrolling.html)

jQuery('a[data-toggle="tab"]').on( 'click', function (e) {
    console.log("tab switch noticed");
    jQuery.fn.dataTable.tables({visible:true,api:true}).columns.adjust();
    } );

jQuery('#community-tabs a').on('click', function (e) {
  e.preventDefault();
  jQuery(this).tab('show');
});

  //setup editor for DataTables
  editorFarmFields = [
            {
              label: "Project",
              name: "farmers.project",
              
              type: "select",
              placeholder: "Select a project"
            },
            {
                label: "",
                name: "farmers.id",
                type: "hidden"
            },{
                label: "Farmer Name:",
                name: "farmers.farmer_name"
            },
            {
                label: "Community:",
                name: "farmers.community_id",
                type: "select",
                placeholder: "Select a Community"
            }
        ];

  editorFarm = new jQuery.fn.dataTable.Editor({
    ajax: vars.editorurl + "/farms.php",
    table: "#farmTable",
    template: "#farm-edit-template",
    fields: editorFarmFields
  });

// Setup dependancy for countries and communities
// This is to set the communities field to automatically update when you select a country in the editor form.
 // editorFarm.dependent('communities.country_id',vars.editorurl + "/country_community.php");

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
        { data: "communities.community_label", title: "VBA (community rep)"},
        // { data: "communities.country_id", title: "Country", visible: false },

        { data: "farmers.id", title: "Farmer Code" },
        { data: "farmers.farmer_name", title: "Farmer Name" },
        // { data: "countries.country_label", title: "Country", visible: false},
        { data: "wp_bp_groups.name", title: "Project" }


      ],
      select: true,
      buttons: [
       { extend: "create", editor: editorFarm },
       { extend: "edit",   editor: editorFarm },
       { extend: "remove", editor: editorFarm }
      ],

    });


    yadcf.init(farmTable, [
                    {
            column_number: 4,
            filter_container_id: "farm_projectFilter",
            filter_type:"select",
            filter_default_label:"Select Project",
            style_class:"form-control filter-control",
            filter_reset_button_text:"Reset"
          },
          {
            column_number: 1,
            filter_container_id: "farm_communityFilter",
            filter_type:"select",
            filter_default_label:"Select VBA",
            style_class:"form-control filter-control",
            filter_reset_button_text:"Reset"
          }
          ]);


        //setup child-row activation:
        //
        jQuery('#farmTable tbody').on('click', 'td.trPlus', function () {
            console.log("clicked");
            var tr = jQuery(this).parents('tr');
            var row = farmTable.row( tr );
            console.log(row);
            if ( row.child.isShown() ) {
                // This row is already open - close it
                console.log("hiding row");
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                //if there is a child row, open it.

                if(row.child() && row.child().length)
                {
                    console.log("showing row");
                    row.child.show();
                }
                else {
                    //else, format it then show it.
                    console.log('making row');
                    //show initial loading icon
                    row.child(initialFarmChildRow(row.data())).show();

                    //calculate the farmer code
                    rdata = row.data();
                    code = rdata.farmers.id;
                    name = rdata.farmers.farmer_name;
                    console.log('rdata',rdata);

                      console.log('code',code);
                    //go get the mustache template
                    jQuery.get(vars.editorurl + '/farm_childrow.mst',function(template){
                      var rendered = Mustache.render(template,{code:code});
                      console.log('rendered',rendered);
                      row.child(rendered).show();

                      //generate the QR code and put it into the template:
                      new QRCode(document.getElementById("farmer_qr_code_"+code),{
                        text: code,
                        width: 100,
                        height: 100,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                      });

                      //setup barcode sample sheet button
                      jQuery('#gen_'+code).click(function(e){

                        //generate codes
                        jQuery.ajax({
                          url: vars.ajaxurl,
                          "type":"POST",
                          "dataType":"json",
                          "data":{
                            "action":"create_barcode",
                            "nonce":vars.pa_nonce,
                            "farm":code,
                            "number":6
                          },
                          success: function(response){
                            console.log("create_barcode response", response);
                            codes = response.data;

                            setup_codeSheet(codes);
                          },
                          error: function(jqXHR,textStatus,errorThrown){
                            console.log("ajax error create barcodes",textStatus);
                            console.log(errorThrown);
                          }
                        });
                      });

                    });

                } //end else
                tr.addClass('shown');
            }
        } );

editorFarm.on('initSubmit',function(e,action){
  if(editorFarm.field('farmers.project').val() == '') {
    this.error('Please select a project');
    return false;
  }
  farmer_code = jQuery('#farmer_code_prefix').html()
  farmer_code += jQuery('#farmer_code_entered').val();
  editorFarm.field('farmers.id').val(farmer_code);
  console.log('farmer_code calc',farmer_code);
  return true;
});

  editorFarm.on('open displayOrder', function(e,mode,action){

    //need to set the farm_id entry value if editing

    jQuery("#DTE_Field_farmers-community_id").change(function(){
      console.log('community updated');
      console.log('community id = ',jQuery(this).val());
      id = jQuery(this).val();
      jQuery('#farmer_code_prefix').html(id);
    });

    jQuery("#DTE_Field_farmers-project").change(function(){
      var pro = jQuery(this).val();
      temp = [
        "NA","RMS","SOILS","FP"
      ]

      pro = temp[pro]
      console.log(pro)
      jQuery("#DTE_Field_farmers-community_id option").each(function() {
        jQuery(this).show();
        val = jQuery(this).val();
        console.log(pro)
        console.log("val = ",val);
        console.log(val.search(pro))
        if(val.search(pro)!=0) {
          if(val!="") {
            jQuery(this).hide();

          }
        }
      }); //end each
    });
  });

}); // end document ready
function initialFarmChildRow(data){
  return "<div id='child-row-" + data.farmers.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}

