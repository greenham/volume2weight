<div class="table-responsive">
  <table id="recipe-table" class="table table-striped">
    <thead>
      <tr>
        <th width="20%">Amount</th>
        <th width="20%">Unit</th>
        <th>Ingredient</th>
      </tr>
    </thead>
    <tbody>
      <tr class="input-row">
        <td>
          <input type="number" id="amount" autocomplete="off" size="3" min="0" class="form-control input-sm" placeholder="Enter an amount to convert..." title="" data-toggle="tooltip">
        </td>
        <td>
          <select id="unit" class="form-control input-sm" title="" data-toggle="tooltip">
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
          <input type="text" id="ingredient" autocomplete="off" class="form-control input-sm" placeholder="Start typing an ingredient name..." title="" data-toggle="tooltip">
        </td>
      </tr>
      <tr class="results-row text-right">
        <td colspan="3" class="conversion-result"></td>
      </tr>
    </tbody>
  </table>
</div>