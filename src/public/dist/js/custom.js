
let route = '#';
let method = 'POST';

let form = {
    array_table : [],
    updated_item : {},
};

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ajaxStart(function() { Pace.restart(); });

// predefined Function

function pad(num, size) {
    var s = "000000000" + num;  // max: 10 char
    return s.substr(s.length-size);
}

function createArrayFromTable(tableId) {
    var table = $('#' + tableId);
    var array = [];

    // Get the column headers (keys)
    var keys = [];
    table.find('thead th').each(function() {
        keys.push( $(this).text().trim() );
    });

    // Get the row data (values)
    table.find('tbody tr').each(function() {
        var row = {};
        $(this).find('td').each(function(index) {
            var cellData;
            var input = $(this).find('input');
            var select = $(this).find('select');
            var button = $(this).find('button');

            if (input.length > 0) {
                cellData = input.val();
            } else if (select.length > 0) {
                cellData = select.val();
            } else if (button.length === 0) {
                cellData = $(this).text().trim();
            }

            if (button.length === 0) {
                row[keys[index]] = cellData;
            }
        });
        array.push(row);
    });

    return array;
}

function renderDropDown(sourceArray, targetSelectorString, keyValue, display, comparedVal = null){

    let htmlOptionString = '<option value="">Select an Option...</option>';

    sourceArray.forEach((option) => {
        let is_selected = option[keyValue] == comparedVal ? "selected" : "";
        htmlOptionString += '<option value="'+ option[keyValue] + '" '+ is_selected +'>' + option[keyValue] + '. ' + option[display] + '</option>';
    });

    $(targetSelectorString).html(htmlOptionString);
    $(targetSelectorString).trigger('change');

}

function filterDropdown(sourceArray, filterKey, valToBeCompared){

    let tmpArray = sourceArray;
    if(valToBeCompared){
        tmpArray = sourceArray.filter(element => element[filterKey] == valToBeCompared);
    }
    return tmpArray;
}

function thousandSeparator(num) {
    if(isNaN(num)){
        num.replace(/,/g, '');
        return num;
    }
    return parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function changeDropDownValue(idSelector, newVal){

    let selected = $(`#${idSelector} option`).toArray().find( e => e.value == newVal);

    $('#' + idSelector).val(newVal);

    $("#select2-"+ idSelector +"-container").text(selected.text);
}

function checkEmptyField(formArray){

    for(let i=0;i<formArray.length;i++){

        let currItem = formArray[i];
        if($(`[name='${currItem.name}']`).prop('required') && (currItem.name == '' || currItem.value =='') ){

            toastr.error("Please fill in the required fields");
            $(`[name='${currItem.name}']`).effect("shake");
            $(`[name='${currItem.name}']`).promise().done(() => {

                let selector = currItem.name;
                if($(`[name='${selector}']`).hasClass('select2')){
                    // $('#select2-'+ selector +'-container').parent().css('border-color', 'red');
                    $('#select2-'+ selector +'-container').parent().addClass('is-invalid-select2');
                }
                else{
                    $(`[name='${selector}']`).addClass('is-invalid')
                }
            });
            return false;
        }
    }
    return true;
}

function resetClassOnChange(formSelector){

    $(formSelector).change(function(event){
        let selector = event.target.id
        if($('#' + selector).hasClass('is-invalid')){
            $('#' + selector).removeClass('is-invalid');
        }
        else if($('#select2-'+ selector +'-container').parent().hasClass('is-invalid-select2')){
            $('#select2-'+ selector +'-container').parent().removeClass('is-invalid-select2');
        }
    });
}

function objectifyForm(formSelector) {

    const form = $(formSelector)[0];
    const formData = {};

    // get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');

    // loop through each input and add its value to the formData object
    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        // skip input if it is disabled or its name is empty
        if (input.disabled || !input.name) {
            continue;
        }

        // check the type of input and add its value to formData
        switch (input.type) {
            case 'checkbox':
                formData[input.name] = input.checked ? 1 : 0;
                break;
            case 'radio':
                if (input.checked) {
                    formData[input.name] = input.value;
                }
                break;
            case 'select-multiple':
                const selectedValues = [];
                for (let j = 0; j < input.options.length; j++) {
                    if (input.options[j].selected) {
                        selectedValues.push(input.options[j].value);
                    }
                }
                formData[ input.name.replace("[]", '') ] = selectedValues;
                break;
            default:
                formData[input.name] = input.value;
                break;
        }
    }


    return formData;
}

// backend processing
function ajaxRequest(url , method, data = {}, show_loading = false){

    console.log('submitting....');

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            data: data,
            // dataType: "json",
            beforeSend: function (jqXHR) {
                if(show_loading){
                    Swal.fire({
                        title: 'Please Wait...',
                        html: 'Loading..',// add html attribute if you want or remove
                        allowOutsideClick: false,
                        showCancelButton: true,
                        showConfirmButton: false

                    })
                        .then(function(){
                            jqXHR.abort();
                        });
                }
            },

            error: function(jqXHR, status){
                let response = jqXHR.responseJSON;
                if(status != 'abort'){
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Oops...',
                        // text: 'Something went wrong! Please contact the administrator',
                        text: response.message,
                    });

                    let errorObject = response.errors;
                    for (const key in errorObject) {
                        if (errorObject.hasOwnProperty(key)) {
                            $('#'+key).addClass('is-invalid');
                            $('#'+key).closest('.form-group .col-sm-10').append(`<span id="${key}-error" class="error invalid-feedback">${errorObject[key]}.</span>`);
                        }
                    }
                }

                reject(response);
            },
            success: function (response) {
                console.log('Submitted successfully!');
                Swal.close();
                resolve(response);
            }
        });
    });
}

function submitData(formSelector, successHandler, errorHandler, show_loading = true){

    $.validator.setDefaults({
        submitHandler: function () {

            form = {
                ...form, ...objectifyForm(formSelector)
            };

            ajaxRequest(route, method, form, show_loading)
                .then((res)=> {

                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Successful!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    form = {
                        array_table : [],
                        updated_item : {},
                    };
                    successHandler(res);
                })
                .catch((err) => errorHandler(err) )
        }
    });
    $(formSelector).validate({
        ignore: [],
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');

            if($(formSelector+'.form-horizontal').length){
                element.closest('.form-group .col-sm-10').append(error);
            }
            else{
                element.closest('.form-group').append(error);
            }
        },
        highlight: function (element, errorClass, validClass) {

            if($(element).hasClass('select2')){
                let tmp_id = $(element).attr('id');
                $('#'+tmp_id).next().find('span.select2-selection').css('border-color', 'red');
            }
            else{
                $(element).addClass('is-invalid');
            }
        },
        unhighlight: function (element, errorClass, validClass) {

            $(element).removeClass('is-invalid');
        }
    });
}

function editData(url, successHandler, errorHandler){

    let method = "GET";

    ajaxRequest(url, method, form, false)
        .then((res) => {
            let data = res.data
            form = res.data

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if($('#'+key).hasClass('select2')){
                        $('#'+key).val(data[key]).select2();
                    }
                    else if($('#'+key).is(':checkbox')){
                        $('#'+key).prop('checked' ,data[key]);
                    }
                    else{
                        $('#'+key).val(data[key]);
                    }
                }
            }
            if(typeof successHandler === 'function'){
                successHandler(res)
            }
        })
        .catch(err => {
            console.log(err)
            if(typeof errorHandler === 'function'){
                errorHandler(err)
            }
        })
}

function deleteData(url, successHandler, errorHandler){
    Swal.fire({
        title: 'Are you sure you want to delete this item?',
        text: "Please confirm the details before submit.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
    }).then((result) => {
        if (result.value) {

            ajaxRequest(url, "DELETE")
                .then(res => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: res.msg,
                        showConfirmButton: false,
                        timer: 1800
                    });
                    if(typeof successHandler === 'function'){
                        successHandler(res)
                    }
                })
                .catch(err => {
                    if(typeof errorHandler === 'function'){
                        errorHandler(err)
                    }
                })
        }
    });
}

function restoreData(url, successHandler, errorHandler){
    form.restore_action = true;
    ajaxRequest(url, "PATCH", form)
        .then(res => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: res.msg,
                showConfirmButton: false,
                timer: 1800
            });
            delete form.restore_action;
            if(typeof successHandler === 'function'){
                successHandler(res)
            }
        })
        .catch(err => {
            if(typeof errorHandler === 'function'){
                errorHandler(err)
            }
        })
}

function resetForm(form_selector){
    $(form_selector).trigger("reset");
    $(form_selector+" select.select2").val(null).trigger('change');
    form = {
        array_table : [],
        updated_item : {},
    };
}

function handleFileUpload(src, route, fileName = "fileName", size = 0){

    if (Dropzone.instances.length > 0) {
        Dropzone.instances[0].destroy();
    }

    var previewTemplate = `<div id class="row mt-2">
                    <div class="col-auto">
                        <span class="preview"><img src="data:," alt="" data-dz-thumbnail /></span>
                    </div>
                    <div class="col d-flex align-items-center">
                        <p class="mb-0">
                            <a class="hyperlink" href="${src}" target="_blank">
                              <span class="lead" data-dz-name></span>
                            </a>
                            (<span data-dz-size></span>)
                        </p>
                        <strong class="error text-danger" data-dz-errormessage></strong>
                    </div>
                    <div class="col-4 d-flex align-items-center">
                        <div class="progress progress-striped active w-100" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
                            <div class="progress-bar progress-bar-success" style="width:0%;" data-dz-uploadprogress></div>
                        </div>
                    </div>
                    <div class="col-auto d-flex align-items-center">
                        <div class="btn-group">
                            <button class="btn btn-primary start">
                                <i class="fas fa-upload"></i>
                                <span>Start</span>
                            </button>
                            <button data-dz-remove class="btn btn-warning cancel">
                                <i class="fas fa-times-circle"></i>
                                <span>Cancel</span>
                            </button>
                            <button data-dz-remove class="btn btn-danger delete">
                                <i class="fas fa-trash"></i>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>`;
    document.querySelector("#previews").innerHTML = '';

    var myDropzone = new Dropzone(document.body,
        { // Make the whole body a dropzone
            url: route, // Set the url
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            sending: function(file, xhr, formData) {
                formData.append("extra_field", $('input[name="extra_field"]').val());
            },
            paramName: "avatar", // The name that will be used to transfer the file
            acceptedFiles: 'image/*',
            thumbnailWidth: 80,
            thumbnailHeight: 80,
            uploadMultiple: false,
            maxFiles: 1,
            autoDiscover: false,
            // parallelUploads: 20,
            previewTemplate: previewTemplate,
            autoQueue: false, // Make sure the files aren't queued until manually added
            previewsContainer: "#previews", // Define the container to display the previews
            clickable: ".fileinput-button", // Define the element that should be used as click trigger to select files.
        }
    )

    myDropzone.on("addedfile", function(file) {
        // Hookup the start button
        file.previewElement.querySelector(".start").onclick = function() {
            try {
                myDropzone.enqueueFile(file);
            } catch (error) {
                // Handle the error
                Swal.fire({
                    icon: 'error',
                    title: 'Error enqueueing file',
                    text: error,
                    showConfirmButton: true,
                    // timer: 1500
                })
            }
        }
    })

    // Update the total progress bar
    myDropzone.on("totaluploadprogress", function(progress) {
        document.querySelector("#total-progress .progress-bar").style.width = progress + "%"
    })

    myDropzone.on("sending", function(file) {
        // Show the total progress bar when upload starts
        document.querySelector("#total-progress").style.opacity = "1"
        // And disable the start button
        file.previewElement.querySelector(".start").setAttribute("disabled", "disabled")
    })

    // Hide the total progress bar when nothing's uploading anymore
    myDropzone.on("queuecomplete", function(progress) {
        document.querySelector("#total-progress").style.opacity = "0"
    })

    myDropzone.on("error", function(file, errorMessage) {
        Swal.fire({
            icon: 'error',
            title: errorMessage,
            text: '',
            showConfirmButton: false,
            timer: 1500
        })
    });

    // Setup the buttons for all transfers
    // The "add files" button doesn't need to be setup because the config
    // `clickable` has already been specified.
    document.querySelector("#actions .start").onclick = function() {
        myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED))
    }
    document.querySelector("#actions .cancel").onclick = function() {
        myDropzone.removeAllFiles(true)
    }

    // If the thumbnail is already in the right size on your server:
    let mockFile = { name: fileName, size: size };
    let callback = null; // Optional callback when it's done
    let crossOrigin = null; // Added to the `img` tag for crossOrigin handling
    let resizeThumbnail = false; // Tells Dropzone whether it should resize the image first

    // Remove any existing thumbnail for the mockFile
    // myDropzone.removeFile(mockFile);

    if(size){
        // Display the latest thumbnail
        myDropzone.displayExistingFile(mockFile, src);
    }

    return myDropzone;


}

// prepare DataTable Sorting
/*$(function(){
    /!* Create an array with the values of all the input boxes in a column *!/
    $.fn.dataTable.ext.order['dom-text'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return $('input', td).val();
            });
    };

    /!* Create an array with the values of all the input boxes in a column, parsed as numbers *!/
    $.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return $('input', td).val() * 1;
            });
    };

    /!* Create an array with the values of all the select options in a column *!/
    $.fn.dataTable.ext.order['dom-select'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return $('select', td).val();
            });
    };

    /!* Create an array with the values of all the checkboxes in a column *!/
    $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return $('input', td).prop('checked') ? '1' : '0';
            });
    };
});*/

/*$('#MainForm').change(function (event) {

    let changedItemId = event.target.id;
    if(!form.hasOwnProperty('updated_item')){
        form.updated_item = {};
    }

    let message = form[changedItemId] + ' -> ' +event.target.value;
    form.updated_item[changedItemId] = message;

    form[changedItemId] = $(event.target).val();

});*/

/*let submittedForm = $('#MainForm').serializeArray();

if(!checkEmptyField(submittedForm)) return;

form = {
    ...form, ...objectifyForm(submittedForm)
};

form.array_table = $.map( Array.from($('input:checkbox').not(".mr-1")) , e => {
    return {
        [parseInt(e.value) + 1]: e.checked
    }
});*/
