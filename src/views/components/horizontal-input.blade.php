<!-- Be present above all else. - Naval Ravikant -->
<div class="form-group row">
    <label for="{{ $id }}" class="col-sm-2 col-form-label">{{ $label }} @if($required)<span class="text-danger">*</span>@endif </label>
    <div class="col-sm-10">
        {{ $slot }}
        {{ $message ?? '' }}
    </div>
</div>

