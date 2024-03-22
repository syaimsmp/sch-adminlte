function alertSwalFire(position,type,icon,title, showConfirmButton, allowOutsideClick, timer){
    Swal.fire({
        position: position,
        type: type,
        icon: icon,
        title: title,
        showConfirmButton: showConfirmButton,
        allowOutsideClick: allowOutsideClick,
        timer: timer
    });
}
function beforeSend(title, html){
    Swal.fire({
        title: title,
        html: html,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading()
        },
    });
}
function errorCall(xhr){
    swal.close();
    var response = JSON.parse(xhr.responseText);
    var errorMessage = response.message;
    alertSwalFire('center', 'error', 'error', 'An error occurred, Please contact PIC!' + '\n\n' + errorMessage, true, false);
}
function errorCallWithRow(xhr){
    swal.close();
    var response = JSON.parse(xhr.responseText);
    var errorMessage = response.message;
    var errors = response.errors; // Parse the errors JSON string
    var row = [];
    for (var i = 0; i < errors.length; i++) {
        //+1 to make it like a row instead of indexes
        row.push(errors[i].itemIndex+1);
    }
    alertSwalFire('center', 'error', 'error', 'An error occurred!' + '\n' + errorMessage + ' at Row: \n' + '[' + row + ']', true, false);
}
function performAjaxRequest(method, url, data, beforeSendCallback, successCallback, errorCallback) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        method: method,
        url: url,
        data: data,
        beforeSend: beforeSendCallback,
        success: successCallback,
        error: errorCallback
    });
}
function table(method, url, data, htmlTableId, tableId, dom, buttonsData, dynamicArray){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $.ajax({
        method: method,
        url: url,
        data: data,
        beforeSend: function (){
            beforeSend("Fetching", "Please Wait..");
        },
        initComplete: function (){

        },
        success: function (response){
            swal.close();
            var Data = response.data;
            Data.forEach(function(dataObj) {
                dynamicArray.push(dataObj);
            });
            renderSuccessTable(response, htmlTableId, tableId, dom, buttonsData);
        },
        error: function (xhr){
            errorCall(xhr)
        }
    })
}
function renderSuccessTable2(response, htmlTableId, tableId, dom, buttonsData){
    $(htmlTableId).html(response.html);
    $(tableId).DataTable({
        "lengthMenu": [[10, 25, 50, 100], [10, 25, 50, 100]],
        "iDisplayLength": 100,
        dom: dom,
        buttons: [
            buttonsData
        ]
    });
}
function populateModalContent(modalId, modalDetails){
    var newTitle = 'Details for ' + modalDetails;
    $(modalId).text(newTitle);
}
function editedColumn(value, id, dynamicArray, property){
    dynamicArray.forEach(function (item, index) {
        if (item.id == id) {
            if (!value) {
                item[property] = "";
            } else {
                item[property] = value ? value : "";
            }
        }
    });
}
function displayArrayFetchId(id, running_no, displayArray) {
    return displayArray.find(item => item.id === id && item.running_no === running_no);
}
function checkbox(checkbox, individualClassName, allClassName, id, running_no, checkboxArray, displayArray, whichOne){
    if (whichOne == 'Individual'){
        const allRowCheckboxesChecked = $(individualClassName).length === $(individualClassName + ':checked').length;
        $(allClassName).prop('checked', allRowCheckboxesChecked);
        if (checkbox.prop('checked')) {
            const rowData = displayArrayFetchId(id, running_no, displayArray);
            rowData ? checkboxArray.push(rowData) : null;
        } else {
            const index = checkboxArray.findIndex(item => item.id === id && item.running_no === running_no);
            index !== -1 ? checkboxArray.splice(index, 1) : null;
        }
    }
    else if (whichOne == 'all'){
        $(individualClassName).prop('checked', checkbox.prop('checked'));
        checkboxArray =  checkbox.prop('checked') ? $(individualClassName + ':checked').map(function () {
            const checkboxId = parseInt($(this).attr('id'));
            const running_no = parseInt($(this).data('running_no'));
            const rowData = displayArrayFetchId(checkboxId, running_no, displayArray);
            return rowData ? rowData : undefined;
        }).get() : [];

        //RETURN THE UPDATED CHECKBOXARRAY TO ORIGIN FILE
        return checkboxArray;
    }
}
function buttonChooseHighlight(nameOfClass, dataValue, idOfClass){
    // Reset styles for all elements
    $(nameOfClass).css('outline', '');
    $(nameOfClass +' img').css('opacity', '0.1');

    // Apply styles to the selected element
    $(idOfClass + dataValue).css('outline', '2px solid lightgreen');
    $(idOfClass + dataValue + ' img').css('opacity', '');
}
function initialButtonChooseHighlight(idOfClass){
    // Highlight the button with value "1" initially
    $(idOfClass).css('outline', '2px solid lightgreen');
    $(idOfClass +' img').css('opacity', '');
    $(idOfClass).trigger('click'); //initially click at value 1
}
function datePickerBCM(dynamicArray1){
    $('.hasDatePicker').datepicker({
        onSelect: function(dateText) {
            var selectedDate = dateText;
            var inputId = $(this).attr('id');
            var parts = inputId.split('_');
            var id = parts[1].split('/')[0];
            var running_no = parts[1].split('/')[1];
            dynamicArray1.forEach(function (item, index) {
                if (item.id == id){
                    item.expired_date = selectedDate;
                }
            })
        },
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true
    }).on('keyup paste', function() {
        var $this = $(this);
        var enteredValue = $this.val();
        var inputId = $this.attr('id');
        var parts = inputId.split('_');
        var id = parts[1].split('/')[0];
        var running_no = parts[1].split('/')[1];

        // Remove any non-digit characters from the entered value
        var numericValue = enteredValue.replace(/\D/g, '');

        // Check if the numeric value has a length of 8 (assumes format: DDMMYYYY)
        if (numericValue.length === 8) {
            var day = numericValue.substr(0, 2);
            var month = numericValue.substr(2, 2);
            var year = numericValue.substr(4, 4);

            // Create a Date object with the extracted day, month, and year
            var date = new Date(year, month - 1, day);

            // Check if the created Date object is a valid date
            if (
                date instanceof Date &&
                !isNaN(date) &&
                date.getDate() === parseInt(day) &&
                date.getMonth() === parseInt(month) - 1 &&
                date.getFullYear() === parseInt(year)
            ) {
                // Format the date as DD-MM-YYYY
                var formattedDate = day + '-' + month + '-' + year;

                // Set the formatted date back into the input field
                $this.val(formattedDate);

                // Update the selectedDate variable
                var selectedDate = formattedDate;

                // Update the dynamicArray1
                dynamicArray1.forEach(function(item, index) {
                    if (item.id == id) {
                        item.expired_date = selectedDate;
                    }
                });
            } else {
                // Invalid date format entered
                $this.val('');

                // Update the dynamicArray1
                dynamicArray1.forEach(function(item, index) {
                    if (item.id == id) {
                        item.expired_date = '';
                    }
                });
            }
        } else {
            // Update the dynamicArray1
            dynamicArray1.forEach(function(item, index) {
                if (item.id == id) {
                    item.expired_date = '';
                }
            });
        }
    });
}

function renderSuccessTable(response, divTableId, tableId, dom, buttons, dynamicArray){
    swal.close();
    $(divTableId).html(response.html);
    $(tableId).DataTable({
        "lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "All"] ],
        // order: [
        //     [3, 'asc'],
        //     [4, 'asc']
        // ],
        dom: dom,
        buttons: [
            buttons
        ]
    });
    var Data = response.data;
    dynamicArray != null ? Data.forEach(function(dataObj) {
        dynamicArray.push(dataObj);
    }) : null;
}
function individualCheckbox(checkbox, individualClassName, allClassName){
    const allRowCheckboxesChecked = $(individualClassName).length === $(individualClassName + ':checked').length;
    $(allClassName).prop('checked', allRowCheckboxesChecked);
}
function findItem(array, criteria) {
    return array.find(item => {
        for (const key in criteria) {
            if (item[key] !== criteria[key]) {
                return false;
            }
        }
        return true;
    });
}
function findIndexByCriteria(array, criteria) {
    return array.findIndex(item => {
        for (const key in criteria) {
            if (item[key] !== criteria[key]) {
                return false;
            }
        }
        return true;
    });
}
function clearDT(tableId){
    $(tableId).DataTable().clear().draw();
}
function dynamicSelect2(selectId, response, valueProperty, dynamicArray, textFunction){
    $(selectId).empty();
    //dynamicArray = response[valueProperty1];
    $.each(dynamicArray, function(index, item) {
        $(selectId).append($('<option>', {
            value: item[valueProperty],
            text: textFunction(item) // Call the provided function to generate the text
        }));
    });
    //remove auto size dropdown based on text
    $(selectId).select2({
        dropdownAutoWidth: false,
        width: '100%'
    });
    // Trigger the 'change' event to update the total slot text for the initial value
    $(selectId).trigger('change');
}
function CRUD(title, text, icon, showCancelButton, confirmButtonColor, cancelButtonColor, confirmButtonText, method, url, data, beforeSendCallback, successCallback, errorCallBack){
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: showCancelButton,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: cancelButtonColor,
        confirmButtonText: confirmButtonText
    }).then((result) => {
        if (result.value) {
            performAjaxRequest(method, url, data, beforeSendCallback, successCallback, errorCallBack)
        }
    });
}
function openModal(route, title, modalId, classModal, mainForm, mode, variableId, variableIdValue) {
    resetFormFields(mainForm);

    $(modalId).modal({backdrop: 'static'}, 'show');
    $(modalId).attr('title', title);
    $(modalId).find(classModal).text(title);
    $(mainForm).attr('action', route);
    $(mainForm).attr('method', 'POST'); // Default to POST
    $(mode).val('create'); // Default to create mode
    $(variableId).val(variableIdValue); // Default to create mode

    // Check if the route contains 'edit' to determine edit mode
    if (route.includes('edit')) {
        $(mode).val('edit'); // Set mode to edit
        performAjaxRequest(
            'GET',
            route,
            {},
            null,
            function (response) {
                var data = response.data;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = $('#' + key);
                        if (element.hasClass('select2')) {
                            element.val(data[key]).trigger('change'); // Use trigger('change') for Select2
                        } else {
                            element.val(data[key]);
                        }
                    }
                }
            },
            function (xhr) {
                errorCall(xhr)
            }
        )
    }
}
function resetFormFields(form_selector) {
    $(form_selector).find(':input:not(select.select2)').val('');
    /*kalau nk reset semua
    $(form_selector).trigger("reset");
    $(form_selector+" select.select2").val(null).trigger('change');*/
}
function CRUD2(url, url2, variableName, variableSpecific, replaceVariable, mode, mainForm, modal, renderFunction){
    $(mode).val();
    var data = $(mainForm).serializeArray();

    if ($(mode).val() === 'create') {
        var method = 'POST';
        var url = url; // Route for creating rack
    } else if ($(mode).val() === 'edit') {
        let variableName = data.find(e => e.name == variableSpecific);
        if(!variableName) return;
        var method = 'PATCH';
        var url = url2.replace(replaceVariable, variableName.value); // Route for updating rack
        //var url = '{{ route('cts.rack_management.update', ['rack_management' => ':rack_id']) }}'.replace(':rack_id', variableName.value); // Route for updating rack
    }
    performAjaxRequest(
        method,
        url,
        data,
        function () {
            $(mode).val() == 'create' ? beforeSend('Creating', 'Please Wait..') : beforeSend('Updating', 'Please Wait..')
        },
        function (response) {
            swal.close();
            $(modal).modal('hide');
            if (typeof renderFunction === 'function') {
                renderFunction();
            }
        },
        function (xhr) {
            errorCall(xhr)
        }
    )
}
function remove(route, renderFunction) {
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
            performAjaxRequest(
                'DELETE',
                route,
                {},
                function () {
                    beforeSend('Deleting', 'Please Wait..')
                },
                function (response) {
                    swal.close();
                    alertSwalFire('top-end', 'success', 'success', response.msg, false, false, 1500);
                    if (typeof renderFunction === 'function') {
                        renderFunction();
                    }
                },
                function (xhr) {
                    errorCall(xhr)
                }

            )
        }
    });
}
