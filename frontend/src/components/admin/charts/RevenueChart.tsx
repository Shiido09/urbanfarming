
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", revenue: 12500, profit: 3750 },
  { month: "Feb", revenue: 15200, profit: 4560 },
  { month: "Mar", revenue: 18900, profit: 5670 },
  { month: "Apr", revenue: 22100, profit: 6630 },
  { month: "May", revenue: 19800, profit: 5940 },
  { month: "Jun", revenue: 25600, profit: 7680 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

const RevenueChart = () => {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="dark:text-white">Revenue vs Profit</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={4} />
            <Bar dataKey="profit" fill="hsl(var(--chart-2))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
