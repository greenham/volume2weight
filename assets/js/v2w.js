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
  var ingredientResults = [];

  $('input#ingredient').on('keyup', function (e) {
    $el = $(this);
    if ($el.val().length > 2) {
      // search through densities and find matching ingredients
      $searchName = event.currentTarget.value;
      var regString = $searchName;
      var regex = new RegExp(regString, "i");
      ingredientResults = _.find(densities, function(item) {
        return regex.test(item.name);
      });
    }
  });
}