var editor;

jQuery(document).ready(function($){
  console.log("stats4sd-js soils Starting again");

  editor = new $.fn.dataTable.Editor({
    ajax: vars.editorurl + "/soils.php",
    table: "#DataTable",
    fields: [
      {label: "Sample_id",
      name: "samples.id"}
    ]
  })

  console.log("current user", vars.user_id);

  //Setup datatables
  var soilsTable = $('#DataTable').DataTable({
    dom:"Bfrtip",
    ajax: {
      url: vars.editorurl + "/soils.php",
      data: {
        "user_id": vars.user_id.groups[0]
      }
    },
    columns: [
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
    ],
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
  });




        $('#DataTable tbody').on('click', 'td.trPlus', function () {
            console.log("clicked");
            var tr = $(this).parents('tr');
            var row = soilsTable.row( tr );
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
  return "<div id='child-row-" + data.samples.id + "'><span class='fa fa-spinner-circle'></span>Loading</div>";
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
});