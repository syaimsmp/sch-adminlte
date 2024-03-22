<!-- Be present above all else. - Naval Ravikant -->
<!-- Date -->
<div class="form-group row">
    <label class="col-sm-2 col-form-label">{{ $label }}</label>
      <div class="input-group date col-sm-10" id="{{ $id }}" data-target-input="nearest">
          <input type="text" class="form-control datetimepicker-input" data-target="#{{ $id }}" {{ $isDisabled ? 'disabled' : '' }}/>
          <div class="input-group-append" data-target="#{{ $id }}" data-toggle="datetimepicker">
              <div class="input-group-text"><i class="fa fa-calendar"></i></div>
          </div>
      </div>
  </div>
