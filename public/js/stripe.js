


$(document).ready(function(){
//go to https://dashboard.stripe.com/account/apikeys
//and copy the test publishable key :=> pk_test_cH3a3psWDQUq77jTPoeQUAIn
  Stripe.setPublishableKey('pk_test_cH3a3psWDQUq77jTPoeQUAIn');

//spinner options :
var opts = {
               lines: 13, // The number of lines to draw
               length: 28, // The length of each line
               width: 14, // The line thickness
               radius: 42, // The radius of the inner circle
               scale: 1, // Scales overall size of the spinner
               corners: 1, // Corner roundness (0..1)
               color: '#000', // #rgb or #rrggbb or array of colors
               opacity: 0.25, // Opacity of the lines
               rotate: 0, // The rotation offset
               direction: 1, // 1: clockwise, -1: counterclockwise
               speed: 1, // Rounds per second
               trail: 60, // Afterglow percentage
               fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
               zIndex: 2e9, // The z-index (defaults to 2000000000)
               className: 'spinner', // The CSS class to assign to the spinner
               top: '50%', // Top position relative to parent
               left: '50%', // Left position relative to parent
               shadow: false, // Whether to render a shadow
               hwaccel: false ,// Whether to use hardware acceleration
               position: 'absolute' // Element positioning
          };


        var $form = $('#payment-form');
            $form.submit(function(event) {
                // Disable the submit button to prevent repeated clicks:
              $form.find('.submit').prop('disabled', true);
              var spinner = new Spinner(opts).spin();
                $('#loading').append(spinner.el);
              // Request a token from Stripe:
              Stripe.card.createToken($form, stripeResponseHandler);
              // Prevent the form from being submitted:
              return false;
            });
});


function stripeResponseHandler(status, response) {
      // Grab the form:
      var $form = $('#payment-form');
        if (response.error) { // Problem!
          // Show the errors on the form:
          $form.find('.payment-errors').text(response.error.message);
          $form.find('.submit').prop('disabled', false); // Re-enable submission
        } else { // Token was created!
          // Get the token ID:
          var token = response.id;
          // Insert the token ID into the form so it gets submitted to the server:
          $form.append($('<input type="hidden" name="stripeToken">').val(token));
          // Submit the form:
          $form.get(0).submit();
        }
    }