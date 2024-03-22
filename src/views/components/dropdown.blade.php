<!-- Simplicity is the ultimate sophistication. - Leonardo da Vinci -->
<div class="form-group row">
    <label class="col-sm-2 col-form-label">{{ $label }} @if($required)<span class="text-danger">*</span>@endif</label>
    <div class="col-sm-10">
        <select id="{{ $id }}" name="{{$name}}" class="form-control select2 " {{ $isMultiple ? 'multiple="multiple"': '' }} {{ $isDisabled ? 'disabled' : '' }} {{ $required ? 'required' : '' }} style="width: 100%;">
            {{ $slot }}
        </select>
    </div>
</div>
