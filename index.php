<? require_once('config.php'); ?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Convert volume measurements to weight for almost any ingredient. Converts US customary units to grams/pounds based on densities of ingredients.">
    <meta name="keywords" content="convert,volume,weight,ingredient,recipe,metric,units,measurement">
    <meta name="author" content="Green Ham Solutions LLC">
    <base href="/">
    <link rel="shortcut icon" href="assets/img/favicon.ico">

    <title>volum.io</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="assets/css/v2w.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="assets/js/html5shiv.js"></script>
      <script src="assets/js/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <div class="container">
      <div class="header">
        <h1 class="text-muted"><a href="/">volum.io</a></h1>
      </div>

      <table id="recipe-table" class="table table-striped">
        <thead>
          <tr>
            <th width="40%">Ingredient</th>
            <th width="15%">Unit</th>
            <th width="10%">Amount</th>
            <th width="10%">Grams</th>
            <th width="10%">Pounds</th>
            <th width="10%">Ounces</th>
            <th width="5%"></th>
          </tr>
        </thead>
        <tbody>
          <td>
            <input type="text" id="ingredient" autocomplete="off" class="form-control" placeholder="Start typing an ingredient name...">
          </td>
          <td>
            <select id="unit" class="form-control">
              <option value="t">t (teaspoons)</option>
              <option value="T">T (tablespoons)</option>
              <option value="floz">floz (fluid ounces)</option>
              <option value="c" selected>c (cups)</option>
              <option value="pt">pt (pints)</option>
              <option value="qt">qt (quarts)</option>
              <option value="gal">gal (gallons)</option>
              <option value="ml">ml (milliliters)</option>
              <option value="dl">dl (deciliters)</option>
              <option value="l">l (liters)</option>
            </select>
          </td>
          <td>
            <input type="text" id="amount" size="3" class="form-control">
          </td>
          <td class="grams conversion-result"></td>
          <td class="pounds conversion-result"></td>
          <td class="ounces conversion-result"></td>
          <td><button class="btn btn-xs btn-default" id="reset-btn" style="display: none;"><span class="glyphicon glyphicon-remove-circle"></span></button></td>
        </tbody>
      </table>

      <div class="footer">
        <p>&copy; <a href="https://greenhamsolutions.com" target="_blank">Green Ham Solutions LLC 2014</a></p>
      </div>

    </div> <!-- /container -->


    <script src="assets/js/jquery-1.11.0.min.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/bootstrap3-typeahead.min.js"></script>
    <script src="assets/js/underscore.min.js"></script>
    <script src="assets/js/v2w.js"></script>

    <? if ($config['ga'] !== false): ?>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', '<?= $config['ga']['ua']; ?>', '<?= $config['ga']['domain']; ?>');
        ga('send', 'pageview');
      </script>
    <? endif; ?>
  </body>
</html>
