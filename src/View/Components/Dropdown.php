<?php

namespace Syaim\DynamicMenu\View\Components;

use Illuminate\View\Component;

class Dropdown extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public $id;
    public $name;
    public $label;
    public $isMultiple;
    public $isDisabled;
    public $required;

    public function __construct($id, $name, $label, $isMultiple = false, $isDisabled = false, $required=false)
    {
        //
        $this->id = $id;
        $this->name = $name;
        $this->label = $label;
        $this->isMultiple = $isMultiple;
        $this->isDisabled = $isDisabled;
        $this->required = $required;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('dynamic_menu::components.dropdown');
    }
}
