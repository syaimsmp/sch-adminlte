<!-- Be present above all else. - Naval Ravikant -->
<div class="modal fade" id="{{ $id }}"{{-- tabindex="-1"--}} role="dialog" aria-labelledby="{{ $id }}Label" aria-hidden="true">
    <div class="modal-dialog {{ $sizeSelection() }}" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="{{ $id }}Label">{{ $title }}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                {{ $slot }}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                @if($isSubmittable)
                    <button id="{{ $id }}SubmitButton" type="button" class="btn btn-primary">Save changes</button>
                @endif
            </div>
        </div>
    </div>
</div>
