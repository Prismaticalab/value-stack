
import React, { useEffect } from "react";
import { Stack } from "@/types/stack";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ProjectListProps {
  stacks: Stack[];
  onLoadStack: (stackId: string) => void;
  onDeleteStack: (stackId: string) => void;
  onCreateNew: () => void;
  getCurrencySymbol: (currency: string) => string;
}

const ProjectList = ({
  stacks,
  onLoadStack,
  onDeleteStack,
  onCreateNew,
  getCurrencySymbol,
}: ProjectListProps) => {
  useEffect(() => {
    // Try to load stacks from localStorage on first render
    const savedStacks = localStorage.getItem("stacks");
    if (savedStacks && stacks.length === 0) {
      // If we have stacks in localStorage but none in state, we can trigger
      // the parent component to load them by creating a new one
      onCreateNew();
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return "Unknown date";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your Projects</h2>
        <Button
          onClick={onCreateNew}
          className="bg-[#9B87F5] hover:bg-[#8A76E4] flex items-center gap-1"
        >
          <PlusCircle size={16} />
          New Stack
        </Button>
      </div>

      {stacks.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-200 p-6">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No saved stacks yet</p>
            <Button
              onClick={onCreateNew}
              className="bg-[#9B87F5] hover:bg-[#8A76E4]"
            >
              Create Your First Stack
            </Button>
          </div>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stacks.map((stack) => {
                const currencySymbol = getCurrencySymbol(stack.currency || 'USD');
                return (
                  <TableRow key={stack.id}>
                    <TableCell className="font-medium">{stack.name}</TableCell>
                    <TableCell>{stack.modules.length}</TableCell>
                    <TableCell>{currencySymbol}{stack.totalCost.toFixed(2)}</TableCell>
                    <TableCell>{currencySymbol}{stack.finalPrice.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(stack.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onLoadStack(stack.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteStack(stack.id)}
                          className="h-8 w-8 p-0 hover:text-red-500"
                        >
                          <Trash size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
