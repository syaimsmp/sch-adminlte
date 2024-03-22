<?php

namespace Syaim\DynamicMenu\View\Components;

use Illuminate\View\Component;

class Checkbox extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public $id;
    public $label;
    public $isDisabled;
    public $checked;
    public $required;

    public function __construct($id, $label, $isDisabled = false, $checked = false, $required = false)
    {
        //
        $this->id = $id;
        $this->label = $label;
        $this->isDisabled = $isDisabled;
        $this->checked = $checked;
        $this->required = $required;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('dynamic_menu::components.checkbox');
    }
}
