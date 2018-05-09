<?php

class PDF extends PDF_Rotate {
    function RotatedText($x,$y,$txt,$angle) {
        //Text rotated around its origin
        $this->Rotate($angle,$x,$y);
        $this->Text($x,$y,$txt);
        $this->Rotate(0);
    }
    /**
     * SetDash([float black, float white])
     * black: length of dashes
     * white: length of gaps
     */
    function SetDash($black=null, $white=null)
    {
        if($black!==null)
            $s=sprintf('[%.3F %.3F] 0 d',$black*$this->k,$white*$this->k);
        else
            $s='[] 0 d';
        $this->_out($s);
    }
}