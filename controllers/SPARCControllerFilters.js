geodash.controllers["SPARCControllerFilters"] = function(
  $scope, $element, $controller, $interpolate, state, map_config, live)
{
  var maxValueFromSummary = geodash.initial_data.layers.popatrisk["data"]["summary"]["all"]["max"]["at_admin2_month"];

  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));

  $scope.filters = geodash.api.getFeatureLayer("popatrisk")["filters"];

  setTimeout(function(){

    // Initialize Checkbox Filters
    $($element).on('change', 'input:checkbox', function(event) {
      console.log(event);
      var that = this;
      var output = $(that).data('output');
      var filter = {};

      var btngroup = $(that).parents('.btn-group:first');
      var output = btngroup.data('output');
      if(filter[output] == undefined)
      {
        filter[output] = [];
      }
      btngroup.find('input').each(function(){
        if($(this).is(':checked'))
        {
          filter[output].push($(this).data('value'))
          $(this).parent('label').removeClass('btn-default').addClass('btn-warning');
        }
        else
        {
          $(this).parent('label').addClass('btn-default').removeClass('btn-warning');
        }
      });
      geodash.api.intend("filterChanged", {"layer": "popatrisk", "filter": filter}, $scope);
    });

    // Initialize Radio Filters
    $($element).on('change', 'input:radio[name="cat"]', function(event) {
      console.log(event);
      var output = $(this).data('output');
      var filter = {};
      filter[output] = this.value;
      geodash.api.intend("filterChanged", {"layer": "popatrisk", "filter": filter}, $scope);
    });

    // Initialize Slider Filters
    $(".geodash-filter-slider", $($element)).each(function(){

      var slider = $(this).find(".geodash-filter-slider-slider");
      var label = $(this).find(".geodash-filter-slider-label");

      var type = slider.data('type');
      var output = slider.data('output');

      if(type=="ordinal")
      {
        var range = slider.data('range');
        //var value = slider.data('value');
        var value = state["filters"]["popatrisk"][output];
        var options = slider.data('options');

        slider.data('label', label);
        geodash.ui_init_slider_label($interpolate, slider, type, range, value);
        geodash.ui_init_slider_slider($interpolate, $scope, slider, type, range, options.indexOf(value), 0, options.length - 1, 1);
      }
      else
      {
        var range = slider.data('range');
        //var value = slider.data('value');
        var minValue = geodash.assert_float(slider.data('min-value'), 0);
        var step = slider.data('step');
        //var label_template = slider.data('label');

        if(($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true"))
        {
          var maxValue = (maxValueFromSummary != undefined && slider.data('max-value') == "summary") ?
              maxValueFromSummary :
              geodash.assert_float(slider.data('max-value'), undefined);
          //
          var values = state["filters"]["popatrisk"][output];
          values = geodash.assert_array_length(values, 2, [minValue, maxValue]);
          var values_n = [Math.floor(values[0]), Math.floor(values[1])];
          var min_n = Math.floor(minValue);
          var max_n = Math.floor(maxValue);
          var step_n = Math.floor(step);

          slider.data('label', label);
          geodash.ui_init_slider_label($interpolate, slider, type, range, values);
          geodash.ui_init_slider_slider($interpolate, $scope, slider, type, range, values_n, min_n, max_n, step_n);
          console.log(value_n, min_n, max_n, step_n, range);
        }
        else
        {
          var maxValue = geodash.assert_float(slider.data('max-value'), undefined);
          var value = state["filters"]["popatrisk"][output];
          var value_n = Math.floor(value * 100);
          var min_n = Math.floor(minValue * 100);
          var max_n = Math.floor(maxValue * 100);
          var step_n = Math.floor(step * 100);

          slider.data('label', label);
          geodash.ui_init_slider_label($interpolate, slider, type, range, value);
          geodash.ui_init_slider_slider($interpolate, $scope, slider, type, range, values_n, min_n, max_n, step_n);
          console.log(value_n, min_n, max_n, step_n, range);
        }
      }
    });

  }, 10);

};
