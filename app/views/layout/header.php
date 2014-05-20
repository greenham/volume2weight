<div class="header row">
  <div class="col-md-4" id="branding">
    <a class="logo" href="/"><img src="assets/img/logo-32.png" align="left"></a>
    <h1 class="brand"><a href="/"><?= $config['brand_name']; ?></a></h1>
    <p class="small muted"><?= $config['slogan']; ?></p>
  </div>
  <div class="col-md-6 col-md-offset-2" id="top-nav">
    <ul class="nav nav-pills nav-justified">
      <li<?= ($page === 'converter') ? ' class="active"':''; ?>><a href="/">Converter</a></li>
      <li<?= ($page === 'why') ? ' class="active"':''; ?>><a href="/why">Why Weight?</a></li>
      <li<?= ($page === 'about') ? ' class="active"':''; ?>><a href="/about">About</a></li>
    </ul>
  </div>
</div>