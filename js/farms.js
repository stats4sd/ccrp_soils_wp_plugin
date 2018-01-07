var farmEditor;
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
            filter_default_label:"Select Community",
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
                    row.child(initialChildRow(row.data())).show();

                    //calculate the farmer code
                    rdata = row.data();
                    code = rdata.communities.community_code
                      .concat("-")
                      .concat(rdata.farmers.farmer_code);
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
                        codes = [
                        code+"00"+1,
                        code+"00"+2,
                        code+"00"+3,
                        code+"00"+4,
                        code+"00"+5,
                        code+"00"+6,
                        code+"00"+7,
                        code+"00"+8,
                        ]

                        jQuery.get(vars.editorurl + '/farm_samplecodes.mst',function(template){
                          var rendered = Mustache.render(template,{
                            farmer_code:code,
                            farmer_name:name,
                            code0:codes[0],
                            code1:codes[1],
                            code2:codes[2],
                            code3:codes[3],
                            code4:codes[4],
                            code5:codes[5],
                            // code6:codes[6],
                            // code7:codes[7]
                          });
                          jQuery('#sample_sheet').html(rendered);
                          jQuery('#samplesheetmodal').modal('toggle');
                          //qr codes!
                          console.log("got mst");
                          
                          new QRCode(document.getElementById('farmer_qrcode'),{
                            text: code,
                            width: 80,
                            height: 80,
                            colorDark : "#000000",
                            colorLight : "#ffffff",
                            correctLevel : QRCode.CorrectLevel.H
                          });

                          for (i=0;i<6;i++) {
                            console.log('code ' + i,code+"00"+i);
                            new QRCode(document.getElementById('code'+i),{
                              text: codes[i],
                              width: 100,
                              height: 100,
                              colorDark : "#000000",
                              colorLight : "#ffffff",
                              correctLevel : QRCode.CorrectLevel.H
                            });
                          }

                          //setup print button;
                          jQuery('#printbutton_'+code).click(function(){
                            console.log('print button clicked');
                            jQuery('#print_modal_'+code).printElement({
                              pageTitle:"SampleSheet_"+name+" - "+code,
                            });
                            
  
                            })
                        });
                      });

                    });

                } //end else
                tr.addClass('shown');
            }
        } );

}); // end document ready
function initialChildRow(data){
  return "<div id='child-row-" + data.farmers.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
}