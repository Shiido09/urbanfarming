
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative";
  trend?: "up" | "down";
  description?: string;
  icon?: LucideIcon;
}

const StatsCard = ({ title, value, change, changeType, trend, description, icon: Icon }: StatsCardProps) => {
  const getChangeColor = () => {
    if (changeType === "positive" || trend === "up") {
      return "text-green-600 dark:text-green-400";
    } else if (changeType === "negative" || trend === "down") {
      return "text-red-600 dark:text-red-400";
    }
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <Card className="w-full dark:bg-gray-800 dark:border-gray-700 transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
            {(change || description) && (
              <p className={`text-xs sm:text-sm mt-1 ${getChangeColor()}`}>
                {change || description}
              </p>
            )}
          </div>
          {Icon && (
            <div className="flex-shrink-0 ml-3">
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
