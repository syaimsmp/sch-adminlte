<?php

namespace Syaim\DynamicMenu\View\Components;

use Illuminate\View\Component;

class Modal extends Component
{
    public $id;
    public $title;
    public $isSubmittable;
    public $size;
    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($id, $title, $size ="medium", $isSubmittable)
    {
        //
        $this->id = $id;
        $this->title = $title;
        $this->isSubmittable = $isSubmittable;
        $this->size = $size;
    }

    public function sizeSelection(){
        if($this->size =="medium"){
            return;
        }
        else if($this->size =="small"){
            return "modal-sm";
        }
        else if($this->size =="large"){
            return "modal-lg";
        }
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return \Illuminate\View\View|string
     */
    public function render()
    {
        return view('dynamic_menu::components.modal');
    }
}
