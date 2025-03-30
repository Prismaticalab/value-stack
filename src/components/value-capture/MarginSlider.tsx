
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MarginSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MarginSlider = ({ value, onChange }: MarginSliderProps) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between">
        <Label htmlFor="desiredMargin" className="text-sm font-medium">
          Desired Profit Margin (%)
        </Label>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Slider
        id="desiredMargin"
        min={0}
        max={300}
        step={1}
        value={[value]}
        onValueChange={(val) => onChange(val[0])}
        className="my-4"
      />
    </div>
  );
};

export default MarginSlider;
