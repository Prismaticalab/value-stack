
interface TotalCostDisplayProps {
  totalCost: number;
  currencySymbol: string;
}

const TotalCostDisplay = ({ totalCost, currencySymbol }: TotalCostDisplayProps) => {
  return (
    <div className="pt-4">
      <div className="flex justify-between items-center text-sm font-medium">
        <span>Current Value Delivery Cost:</span>
        <span>{currencySymbol}{totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TotalCostDisplay;
