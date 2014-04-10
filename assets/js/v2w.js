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
  $('input#ingredient').on('keyup', function (e) {

    var $el = $(this);

    if ($el.val().length > 2)
    {
      // search through densities and find matching ingredients
      $searchName           = event.currentTarget.value;
      var regString         = $searchName;
      var regex             = new RegExp(regString, "i");

      var ingredientResults = _.filter(densities, function (item) {
        return regex.test(item.name);
      });

      if (ingredientResults !== undefined && ingredientResults.length > 0)
      {
        // map results to names
        var ingredientNames = _.map(ingredientResults, function (item) {
          return item.name;
        });

        if (ingredientNames !== undefined && ingredientNames.length > 0) {
          $el.typeahead({source: ingredientNames});
        }
      }
    }

  });
}