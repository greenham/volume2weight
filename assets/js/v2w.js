$(function() {
  var densities;

  $.post(
    'server.php',
    {action: "initData"},
    function (data) {
      if (data.status == 'success') {
        densities = data.data;
      } else if (data.status == 'error') {
        console.error(data.message);
      }
    },
    'json'
  );
});