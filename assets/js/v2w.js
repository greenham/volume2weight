$(function() {
  var densities;

  if (localStorage && localStorage.getItem('v2w-densities')) {
    densities = JSON.parse(localStorage.getItem('v2w-densities'));
  } else {
    densities = initData();
  }

  console.log(densities);

  if (densities.length > 0) {
    startApp(densities);
  } else {
    // @todo handle gracefully
  }
});

function initData()
{
  $.post(
    'server.php',
    {action: "initData"},
    function (data) {
      if (data.status == 'success') {
        densities = data.data;
        if (localStorage) {
          localStorage.setItem('v2w-densities', JSON.stringify(densities));
        }
        return densities;
      } else if (data.status == 'error') {
        console.error(data.message);
        return [];
      }
    },
    'json'
  );
}

function startApp(densities)
{
  var ingredientNames = _.map(densities, function (item) {
    return item.name;
  });

  $('input#ingredient').typeahead({
    source: ingredientNames,
    minLength: 3
  });
}