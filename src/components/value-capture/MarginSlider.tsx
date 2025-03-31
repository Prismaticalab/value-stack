
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MarginSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  maxValue?: number;
}

const MarginSlider = ({ 
  value, 
  onChange, 
  label = "Desired Profit Margin (% of delivery cost)",
  maxValue = 300
}: MarginSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="desiredMargin" className="text-sm font-medium">
          {label}
        </Label>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Slider
        id="desiredMargin"
        min={0}
        max={maxValue}
        step={1}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="my-2"
      />
    </div>
  );
};

export default MarginSlider;
