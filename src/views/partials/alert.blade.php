@if(session('success'))
    {{--<div class="alert alert-success" role="alert">
        {{ session('success') }}
    </div>--}}
    {{--var Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
    });--}}
    <script>

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '{{ session("success") }}',
            showConfirmButton: false,
            timer: 1500
        })
    </script>
@endif
@if(session('error'))
    <script>

        Swal.fire({
            // position: 'top-end',
            icon: 'error',
            title: '{{ session("error") ?? 'Oops...Something went wrong!' }}',
            text: '',
            showConfirmButton: false,
            timer: 1500
        })

        {{--Swal.fire({--}}
        {{--    position: 'top-end',--}}
        {{--    icon: 'error',--}}
        {{--    title: 'Oops...Something went wrong!',--}}
        {{--    text: '{{ session("error") }}',--}}
        {{--})--}}
    </script>
@endif
@if(session('warning'))
    <script>
        Swal.fire({
            title: 'Warning!',
            text: "{{ session("warning") ?? "Are you really sure?" }}",
            icon: 'warning',
        })
    </script>
@endif
