import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export const description = "A line chart with a label";

const chartData = [
  { month: "January", registered: 2 },
  { month: "February", registered: 0 },
  { month: "March", registered: 4 },
  { month: "April", registered: 0 },
  { month: "May", registered: 3 },
  { month: "June", registered: 0 },
];

const chartConfig = {
  registered: {
    label: "registered",
    color: "blue",
  },
} satisfies ChartConfig;

export default function FireArmChart() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Registered Firearm</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="registered"
              type="natural"
              stroke="var(--color-registered)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-registered)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground mt-1">
          Showing registered firearms for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
