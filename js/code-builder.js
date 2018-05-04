function setup_codeSheet(codes,farmer=null){

  //get the mustache template for the codesheet;
  jQuery.get(vars.mustache_url + '/farm_samplecodes.mst',function(template){
    
    //render it using the codes data
    var rendered = Mustache.render(template,{
      farmer:farmer,
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
    
    
    //define specific code for this sheet;
    
    //if a farmer is specified, render their unique QR code
    if(farmer){

      new QRCode(document.getElementById('farmer_qrcode'),{
        text: farmer.code,
        width: 80,
        height: 80,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      });
    }
    


    //for each code, render it:
    for (i=0;i<codes.length;i++) {
      console.log('code ' + i,codes[i]+"00"+i);
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
    jQuery('#printbutton').click(function(){
      console.log('print button clicked');
      if(farmer) pageTitle = "Sample Sheet - Farmer "+ farmer.code
      else pageTitle = "Sample Sheet"

      jQuery('#print_modal').printElement({
        pageTitle:pageTitle
      });
      

    });
  });
}

function getCodes(number,farmer=null){
  data = {
    "action":"create_barcode",
    "nonce":vars.pa_nonce,
    "number":number
  }

  if(farmer){
    data.root_id = farmer.code
  }
  else{
    data.root_id = Math.floor(1000 + Math.random() * 9000);
  }
  console.log("vars,",vars);
  //generate codes
  jQuery.ajax({
    url: vars.ajax_url,
    type:"POST",
    dataType:"json",
    data:data,
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
}