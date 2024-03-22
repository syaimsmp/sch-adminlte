@foreach($data as $datum)
    @if(data_get($datum, 'children', collect([]))->count())
        <li class="nav-item">
            <a href="#" class="nav-link">
                <i class="nav-icon {{ data_get($datum, 'icon') }}"></i>
                <p>
                    {{ data_get($datum, 'name') }}
                    <i class="right fas fa-angle-left"></i>
                </p>
            </a>
            <ul class="nav nav-treeview">
                @include('sch.adminlte.partials._recursive_sidebar', ['data' => data_get($datum, 'children')])
            </ul>
        </li>
    @else
        @can(data_get($datum, 'permissions'))
            <li class="nav-item">
                <a href="{{ data_get($datum, 'route') }}" class="nav-link">
                    <i class="{{ data_get($datum, 'icon') }} nav-icon"></i>
                    <p>{{ data_get($datum, 'name') }}</p>
                </a>
            </li>
        @endcan
    @endif
@endforeach

