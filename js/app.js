var app_url = 'https://script.google.com/macros/s/AKfycbwfocrcrVTYFYus1z9-WOLaBsN8yEbq4175WrCL_hq8mCOu13vi_vTPZLYB6WzsV_bJ/exec';

var price_standard = 8000000;
var price_vip = 8000000;
var price_workshop = 8000000;
var early_bird_day = Date.parse("25 Oct 2024 23:59:00 GMT");
var now = new Date().getTime();
var discount = 0.3; // 20%
var discount2 = 0.35; // 20%
var vat = 0.08 // VAT 8%

jQuery(function ($) {
    /** Anphabe function */
    function updateUtmInput() {
        let query = window.location.search;  
        let searchParams = new URLSearchParams(query);
        if ( searchParams.has("utm_campaign")) {
            jQuery('[name ="utm_campaign"]').val(searchParams.get("utm_campaign"));
        }
        if ( searchParams.has("utm_source")) {
            jQuery('[name ="utm_source"]').val(searchParams.get("utm_source"));
        }
        if ( searchParams.has("utm_medium")) {
            jQuery('[name ="utm_medium"]').val(searchParams.get("utm_medium"));
        }
        if ( searchParams.has("utm_term")) {
            jQuery('[name ="utm_term"]').val(searchParams.get("utm_term"));
        }
        if ( searchParams.has("utm_content")) {
            jQuery('[name ="utm_content"]').val(searchParams.get("utm_content"));
        }
        jQuery('[name ="landingpage"]').val(window.location.origin+window.location.pathname);
    }
        
    $(document).ready(function () {
        updateUtmInput();

        init();

        $('#price_standard_text').text(price_standard.toLocaleString() + " VND");
        $('#price_vip_text').text(price_vip.toLocaleString() + " VND");
        $('#price_workshop_text').text(price_workshop.toLocaleString() + " VND");

        $('.select-price').change(function () {

            var num_standard = $('#num_standard').val() || 0;
            var num_vip = $('#num_vip').val() || 0;
            var num_workshop = $('#num_workshop').val() || 0;

            var price_sum = price_standard * num_standard + price_vip * num_vip + price_workshop * num_workshop;
            var price_discount = 0;

            if ((now < early_bird_day) || (num_standard >= 3 && num_standard < 5)) {
                price_discount = price_sum * discount;
            }
            if (num_standard >= 5 ){
                price_discount = price_sum * discount2;
            }
            var price_sub_total = price_sum - price_discount;
            var price_vat = price_sub_total * vat;
            var price_total = price_sub_total + price_vat;

            $('#price_sum').val(price_sum);
            $('#price_vat').val(price_vat);
            $('#price_total').val(price_total);
            $('#price_discount').val(price_discount);
            $('#price_sum_text').text(price_sum.toLocaleString());
            $('#price_vat_text').text(price_vat.toLocaleString());
            $('#price_discount_text').text(price_discount.toLocaleString());
            $('#price_total_text').text(price_total.toLocaleString() + " VND");

        });

        // Init value
        $('#num_standard').val(1).trigger('change');


        $("form input:radio, input:checkbox").click(function () {
            enableDetail(this.value);
            validationEventType();
        });
        $('input[data-required="true"]').blur(function () {
            validationRequiredElement($(this))
        })
        $('#email').blur(function () {
            validationEmailField($(this));
        })

        $('.close-thankyou').click(function () {
            window.location.href = "https://event.anphabe.com/vietnambestplacestowork/2024/?register_success=1";
        })

        $(".form-register").submit(function (e) {
            e.preventDefault();
            var error = validation();

            if (error) {
                $('html, body').animate({
                    scrollTop: ($(".has-warning").first().offset().top - 20)
                }, 500);
                $('.form-control-warning').first().focus();

                return false;
            }

            else {

                $('#btn-register').addClass('disabled');
                dataString = $(".form-register").serialize();
                $.ajax({
                    type: "POST",
                    url: app_url,
                    data: dataString,
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        if (data.result == 'success') {
                            // Tracking Conversion Ads
                            var tracking_obj = new Object();
                            tracking_obj['event'] = 'contact_form_submit';
                            tracking_obj['ContactForm.fullname'] = $('#name').val();
                            tracking_obj['ContactForm.email'] = $('#email').val();
                            tracking_obj['ContactForm.phone'] = $('#cell_phone').val();
                            window.dataLayer.push(tracking_obj);


                            $('#myModal').modal('show');
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                'event': 'mioTracking',
                                'mioTracking.category': 'Event Register',
                                'mioTracking.action': 'Event Register Success'
                            });
                        }
                        else {
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({
                                'event': 'mioTracking',
                                'mioTracking.category': 'Event Register',
                                'mioTracking.action': 'Event Register Error'
                            });
                            $('#error_message').modal('show');
                        }
                    },
                    error: function (error) {
                    }
                });
            }
            return false;
        });


    }); // end function document ready

    function clearForm() {
        $(":text").val("");
    }


    function init() {
        $(".bank-transfer-detail").hide();
        $(".red-invoice-detail").hide();
        $(".cash-detail").show();
        $(".cash-detail__cod").hide();
    }


    function enableDetail(RadioChecked) {
        switch (RadioChecked) {
            case "bank-transfer":
                $(".bank-transfer-detail").show();
                $(".cash-detail").hide();
                break;
            case "cash":
                $(".cash-detail").show();
                $(".bank-transfer-detail").hide();
                break;
            case "red-invoice":
                $('.red-invoice-detail').toggle();
                break;
            case "pay-directly":
                $('.cash-detail__pay-directly').show();
                $('.cash-detail__cod').hide();
                break;
            case "pay-cod":
                $('.cash-detail__pay-directly').hide();
                $('.cash-detail__cod').show();
                break;
        }
    }

    function checkAttend() {
        var username = $("#username-value").val();
        var validation = "";
        if ($("#place-attend-1").is(":checked") || $("#place-attend-2").is(":checked")) {
            validation = "";
        }
        else {
            validation = "Please choose a place attend <br/>";
        }
        return validation;
    }


    function validationEmailFormat(emailtest) {
        var vari_email = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
        return vari_email.test(emailtest);
    }


    function validationEmailField(email_input) {
        var error = false;
        if (!validationEmailFormat(email_input.val())) {
            if (!email_input.hasClass('form-control-warning')) {
                $(email_input).closest('.form-group').addClass('has-warning');
                $(email_input).addClass('form-control-warning');
                $(email_input).after('<div class="form-control-feedback text-danger">Email không hợp lệ!</div>');
            }

            error = true;
        }
        else {
            if (email_input.hasClass('form-control-warning')) {
                email_input.closest('.form-group').removeClass('has-warning');
                email_input.removeClass('form-control-warning');
                email_input.next('.form-control-feedback').remove();
            }

            email_input.closest('.form-group').addClass('has-success');
            email_input.addClass('form-control-success');

        }
        return error;
    }

    function validationRequiredElement(element) {
        var error = false;
        if (!element.val()) {
            if (!element.hasClass('form-control-warning')) {
                element.closest('.form-group').addClass('has-warning');
                element.addClass('form-control-warning');
                element.after('<div class="form-control-feedback text-danger">Đây là thông tin bắt buộc! (This field is required!)</div>');
            }

            error = true;
        }
        else if (element.val()) {
            if (element.hasClass('form-control-warning')) {
                element.closest('.form-group').removeClass('has-warning');
                element.removeClass('form-control-warning');
                element.next('.form-control-feedback').remove();
            }

            element.closest('.form-group').addClass('has-success');
            element.addClass('form-control-success');

        }
        return error;
    }

    function validationRequiredFields() {
        var error = false;
        $('input[data-required="true"]:visible').each(function (index, element) {
            var valid = validationRequiredElement($(this));
            error = error || valid;
        });
        return error;
    }

    function validationEventType() {
        var error = false;
        if ($("#event").is(":checked") || $("#event2").is(":checked")) {
            $('.event-type').removeClass('has-warning');
            $('.event-type .form-control-feedback').remove();
        }
        else {
            $('.event-type').not('.has-warning').addClass('has-warning').append('<div class="form-control-feedback">Vui lòng chọn sự kiện!</div>');
            var error = true;
        }
        return error;
    }

    function validation() {
        error2 = validationRequiredFields();
        error3 = validationEmailField($('#email'));
        return error2 || error3;
    }

});
