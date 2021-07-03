/**
 * @author : @cloudwhen
 * @file   : unsaTable
 * @dependency: jquery v5+
 * 
 * */
 

function unsaTable()
{
  var selfie = this;
  var parent;
  var table;
  var config;

  var totalPage = 0;
  var activePage = 1;
  var totalRow = 0;
  var pageBar;
  var navBar;
  var messager;
  var showTitleOnTableData = false;
  var highlightSelectedRow = false;

  this.initialize = function(src, conf){
    parent = src;
    config = $.extend({
      css: 'w3-bordered w3-border',
      baseCss: 'w3-table',
      headers: [],
      theadCss: 'w3-light-gray',
      textEmptyTable: 'Nothing to show',
      textLoading: 'Loading...',
      showButtons: false,
      buttons: [],
      data: [],
      rowsPerPage: 25,
      navbarButtonPrev: {
        label: '<< PREV',
        css : 'w3-small w3-button w3-blue w3-hover-teal w3-round w3-padding-small',
        title: 'Go to previous page'
      },
      navbarButtonNext: {
        label: 'NEXT >>',
        css : 'w3-small w3-button w3-blue w3-hover-teal w3-round w3-padding-small',
        title: 'Go to next page'
      },
    }, conf);

    selfie._buildTable(config);
  }

  this._buildTable = function(t){
    var head;
    var str = '<table class="'+t['baseCss']+' '+ t['css']+'">';
    // build the headers (loop)
    str += '<thead class="'+t['theadCss']+'">';

    if(config['showButtons']){
      str += '<th style="width:1.5em">&boxminus;</th>';
    }

    for(i=0;i<t.headers.length;i++){
      head = $.extend({
        'css': '',
        'style': '',
        'label': 'head',
        'thtd': '', // adds custom css to both th and td for responsive
      }, t['headers'][i]);
      str += '<th class="'+head['css']+' '+head['thtd']+'" style="'+head['style']+'">'+head['label']+'</th>';
    }

    str +='</thead><tbody></tbody></table>';

    str += '<div class="w3-row">'; // row 
    str += '<div class="w3-col  s3 m6 l6 unsa-table-navbar"><div class="w3-bar w3-padding-small"></div></div>'; // col
    str += '<div class="w3-col  s9 m6 l6 unsa-table-pagebar"><div class="w3-bar w3-padding-small"></div></div>'; // col
    str += '<div class="w3-col  s12 m12 l12 unsa-table-message"><div class="w3-bar w3-padding-small"></div></div>'; // col
    str += '</div>'; // end row
    //textEmptyTable


    parent.empty().append(str);

    navBar = parent.find('.unsa-table-navbar');
    pageBar = parent.find('.unsa-table-pagebar');
    messager = parent.find('.unsa-table-message');

  }
  //--

  this.parse = function(data){

    if(data.length > 0){
      var str = '';
      var loopcount = 0;
      var rowCount = 1;
      var rowData;
      var i = 0;
      var z = 0;
      var k = 0;
      var btn = '';
      var btnObj;
      var thtd = '';

      navBar.find('.w3-bar').empty();
      pageBar.find('.w3-bar').empty();

      for(i; i<data.length;i++) {
       // btn = '';
        rowData = data[i];

        thtd = '';


        if(loopcount == config['rowsPerPage']) {
          rowCount++;
          loopcount = 0;
          
        }
        str += '<tr data-rowid="'+rowData['id']+'" class="unsa-table-row-'+rowCount+'">';
          btn = '';
          // lets add one td if showbutton option is `true`
          if(config['showButtons']){
            
            btn = '<td>';
            k = 0;
            for(k; k<config['buttons'].length; k++){
              btnObj = $.extend({
                label: '',
                css: '',
                style: '',
                title: ''
              }, config['buttons'][k]);
              btn += '<button title="'+btnObj['title']+'" data-rowid="'+rowData['id']+'" style="'+btnObj['style']+'" class="'+btnObj['css']+'">'+btnObj['label']+'</button>';
            }
            btn += '</td>';
            // btn = '<td><button class="w3-button w3-small w3-blue">o</button>';
          }
          str += btn;
          // loop inside data object for the td 
          z = 0;
          for(z; z<rowData['data'].length; z++){

            if(config['headers'][z]['thtd']) thtd = config['headers'][z]['thtd'];

            if(showTitleOnTableData == true) str += '<td class="'+thtd+'" title="'+rowData['data'][z]+'">'+rowData['data'][z]+'</td>';
            else str += '<td class="'+thtd+'">'+rowData['data'][z]+'</td>';            
          }

        str +='</tr>';
        loopcount++;
        totalRow++;

      }
      totalPage = rowCount;
      activePage = 1;
      selfie._tableClear();
      parent.find('tbody').append(str);
      var btnPrev = '<button class="w3-bar-item nav-btn-prev '+config['navbarButtonPrev']['css']+'">'+config['navbarButtonPrev']['label']+'</button>';
      var btnNext = '<button style="margin-left:2px" class="nav-btn-next w3-bar-item '+config['navbarButtonNext']['css']+'">'+config['navbarButtonNext']['label']+'</button>';
      navBar.find('.w3-bar').empty().append(btnPrev+ ' ' + btnNext);      

      selfie._hideRows(1);
      selfie._totalRow();

      navBar.find('.nav-btn-next').on('click', function(){
        if(activePage >= rowCount) return false;
        activePage++;
        selfie._hideRows(activePage);
        selfie._totalRow();
      });

      navBar.find('.nav-btn-prev').on('click', function(){
        if(activePage <= 1) return false;
        activePage--;
        selfie._hideRows(activePage);
        selfie._totalRow();
      });

      if(highlightSelectedRow == true) selfie._hightLightSelectedRow();      
      

    } else {

      selfie._tableClear();
      pageBar.find('.w3-bar').empty();
      navBar.find('.w3-bar').empty();
      messager.html('<p style="padding:2px margin;2px;text-align:center;">No data to show...</p>');
    }
  }
  //--
  this._totalRow = function(){
    var lblPageCount = '<label class="w3-right w3-bar-item">Total: <span class="w3-tag w3-pink w3-round">'+totalRow+ '</span></label>';
    lblPageCount += '<label class="w3-right w3-bar-item">Page'+(totalPage > 1 ? 's': '')+':<span class="w3-tag">'+activePage+'</span> /'+totalPage+'</label>';    
    pageBar.find('.w3-bar').empty().append(lblPageCount);
    messager.empty();
  }
  //--
  this._hideRows = function(showActive) {
    parent.find('table tbody tr').hide().removeClass('w3-light-gray');
    parent.find('table tbody tr.unsa-table-row-'+showActive).fadeIn();
  }
  //--
  this._tableClear = function(){
    parent.find('table tbody').empty();
  }
  //--
  this._hightLightSelectedRow = function(){

    parent.find('table tbody tr').on('click', function(){
      var obj = $(this);
      parent.find('table tbody tr').removeClass('w3-light-gray');
      setTimeout(function(){
        obj.addClass('w3-light-gray');
      }, 50);
    });
  }
  //--
  this.showTitleToolTips = function(t){
    if(t == true) showTitleOnTableData = true;
    else showTitleOnTableData = false;
  }
  //--
  this.enableHighLightSelectedRow = function(r){
    if(r == true) highlightSelectedRow = true;
    else highlightSelectedRow = false;
  }
  //--
}

