<div class="row">
  <div class="table-responsive well" id="converter">
    <table id="recipe-table" class="table table-striped">
      <thead>
        <tr>
          <th width="10%">Amount</th>
          <th width="20%">Unit</th>
          <th>Ingredient</th>
          <th width="12%">Grams</th>
          <th width="12%">Pounds</th>
          <th width="12%">Ounces</th>
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
            <div class="input-group">
              <input type="text" autocomplete="off" class="ingredient-input form-control input-lg" placeholder="Start typing an ingredient name..." title="" data-toggle="tooltip">
              <span class="input-group-addon">
                <button class="btn btn-sm btn-default disabled remove-ingredient"><span class="glyphicon glyphicon-remove-circle"></span></button>
              </span>
            </div>
          </td>
          <td class="grams-result result-cell"></td>
          <td class="pounds-result result-cell"></td>
          <td class="ounces-result result-cell"></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>