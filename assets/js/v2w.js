$(function() {
  var densities;

  if (localStorage && localStorage.getItem('v2w-densities')) {
    densities = JSON.parse(localStorage.getItem('v2w-densities'));
  } else {
    densities = initData();
  }

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
  var $ingredientInput = $('input#ingredient');
  var $amountInput = $('input#amount');
  var $unitSelect = $('select#unit');
  var $convertBtn = $('button#convert-btn');

  var ingredientNames = _.map(densities, function (item) {
    return item.name;
  });

  $ingredientInput.typeahead({
    source: ingredientNames,
    minLength: 3
  });

  $convertBtn.click(function (e) {
    var ingredient = $ingredientInput.val();
    var amount = $amountInput.val();
    var unit = $unitSelect.children(':selected').val();

    // find g/ml for this ingredient
    var density = _.find(densities, function (item) {
      return item.name == ingredient;
    });

    alert("Density is " + density.g_ml + "g/ml");
  });
}