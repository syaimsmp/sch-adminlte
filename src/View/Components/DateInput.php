<?php

namespace Syaim\DynamicMenu\View\Components;

use Illuminate\View\Component;

class DateInput extends Component
{
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public $id;
    public $label;
    public $isDisabled;

    public function __construct($id, $label, $isDisabled = false)
    {
        //
        $this->id = $id;
        $this->label = $label;
        $this->isDisabled = $isDisabled;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('dynamic_menu::components.date-input');
    }
}
