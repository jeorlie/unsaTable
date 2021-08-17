# unsaTable
a simple table library using jquery | can responsive | using w3.css but you can use other css lib too.

dependency optional:
w3.css found at https://www.w3schools.com/w3css/

usage:

<script>
  var table;
  table = new unsaTable();
  table.initialize($(".target-div"), {
    headers: [
      {label:'Fullname', style:'width:350px', css: 'example-css hide-small-css'},
      {label:'Address'},
    ]
  });
  
  table.parse([]);

  
</script>

