<div class="row">
  <div class="col-md-10">
    <div class="table-responsive well" id="converter">
      <table id="recipe-table" class="table table-striped">
        <thead>
          <tr>
            <th width="10%">Amount</th>
            <th width="20%">Unit</th>
            <th>Ingredient</th>
            <th>Grams</th>
            <th>Pounds</th>
            <th>Ounces</th>
          </tr>
        </thead>
        <tbody>
          <tr class="input-row">
            <td>
              <input type="number" autocomplete="off" size="3" min="0" class="amount-input form-control input-lg" placeholder="" title="" data-toggle="tooltip">
            </td>
            <td>
              <select class="unit-input form-control input-lg" title="" data-toggle="tooltip">
                <optgroup label="US Volume">
                  <option value="t" selected>teaspoons</option>
                  <option value="T">tablespoons</option>
                  <option value="floz">fluid ounces</option>
                  <option value="c">cups</option>
                  <option value="pt">pints</option>
                  <option value="qt">quarts</option>
                  <option value="gal">gallons</option>
                </optgroup>
                <optgroup label="Metric Volume">
                  <option value="ml">milliliters</option>
                  <option value="dl">deciliters</option>
                  <option value="l">liters</option>
                </optgroup>
                <optgroup label="Weights">
                  <option value="oz">ounces</option>
                  <option value="lb">pounds</option>
                </optgroup>
              </select>
            </td>
            <td>
              <input type="text" autocomplete="off" class="ingredient-input form-control input-lg" placeholder="Start typing an ingredient name..." title="" data-toggle="tooltip">
            </td>
            <td class="grams-result result-cell"></td>
            <td class="pounds-result result-cell"></td>
            <td class="ounces-result result-cell"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-md-2">
    <? if ($config['ads'] === true): ?>
      <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=ss_til&ad_type=product_link&tracking_id=volumio-20&marketplace=amazon&region=US&placement=B005QRWEBK&asins=B005QRWEBK&linkId=S3PMSOXPYDINA5TE&show_border=true&link_opens_in_new_window=true"></iframe><br>
      <iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ss&ref=ss_til&ad_type=product_link&tracking_id=volumio-20&marketplace=amazon&region=US&placement=B0012LOQUQ&asins=B0012LOQUQ&linkId=4ASPQMG5THVUHMHN&show_border=true&link_opens_in_new_window=true"></iframe>
    <? endif; ?>
  </div>
</div>