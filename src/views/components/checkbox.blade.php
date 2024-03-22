<!-- The whole future lies in uncertainty: live immediately. - Seneca -->
<div class="form-group row">
    <div class="col-sm-2">
        <label for="{{ $id }}">{{ $label }}</label>
    </div>
    <div class="col-sm-10">
        <input  type="hidden" value="0" name="{{ $id }}" >
        <input style="scale:1.9" value="1" name="{{ $id }}" type="checkbox" id="{{ $id }}" {{ $isDisabled ? 'disabled' : '' }} {{ $checked ? 'checked' : '' }} {{ $required ? 'required' : ''}}>
    </div>
</div>
