<?php

namespace Syaim\DynamicMenu\View\Components;

use Illuminate\View\Component;

class HorizontalInput extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public $id;
    public $label;
    public $required;

    public function __construct($id, $label, $required = false)
    {
        //
        $this->id = $id;
        $this->label = $label;
        $this->required = $required;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('dynamic_menu::components.horizontal-input');
    }
}
