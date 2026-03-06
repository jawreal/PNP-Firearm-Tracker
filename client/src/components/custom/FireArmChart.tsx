import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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
import useFetchData from "@/hooks/useFetchData";
import { useMemo } from "react";
import { TrendingUp } from "lucide-react";

export const description = "A bar chart with a label";

interface ChartValue {
  month: string;
  registered: number;
}

interface ChartData {
  chartStat: ChartValue[];
  startAndEnd: string;
}

const chartConfig = {
  registered: {
    label: "registered",
    color: "blue",
  },
} satisfies ChartConfig;

const ChartFallback = () => {
  return (
    <div className="w-full min-h-[30rem] flex flex-col justify-center items-center gap-y-2 text-center">
      <img
        src="/error_chart.svg"
        alt="error chart"
        className="w-40 h-40 bg-indigo-200/30 dark:bg-indigo-950/60 rounded-md border border-indigo-200 dark:border-indigo-900"
      />
      <div className="flex flex-col">
        <span>Something went wrong</span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          please check your connection
        </span>
      </div>
    </div>
  );
};

export default function FireArmChart() {
  const queryKey = useMemo(() => ["dashboard-chart"], []);
  const { data, isLoading } = useFetchData<ChartData>(
    `/api/dashboard/retrieve/chart/stats`,
    queryKey,
    true,
  );
  const statExist = useMemo(
    () => data?.chartStat && data?.chartStat?.length > 0 && !isLoading,
    [data],
  );

  const trendingPercent = useMemo(() => {
    if (!statExist) return null;

    const latest = data?.chartStat[data?.chartStat?.length - 1].registered;
    const previous = data?.chartStat[data?.chartStat?.length - 2].registered;

    if (!latest || !previous) return null;

    return (latest - previous) / previous;
  }, [data, statExist]);

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Registered Firearm</CardTitle>
        <CardDescription>
          {data?.startAndEnd ?? "Error displaying start month to end"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!statExist && <ChartFallback />}
        {statExist && (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={data?.chartStat}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="registered"
                fill="var(--color-registered)"
                radius={8}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 mt-1 text-sm">
        {trendingPercent && (
          <div className="flex gap-2 leading-none font-medium">
            {trendingPercent > 0
              ? "Registrations increased"
              : "Registrations decreased"}{" "}
            by {Math.abs(trendingPercent)} this month
            <TrendingUp className="h-4 w-4" />
          </div>
        )}
        {statExist && (
          <div className="leading-none text-muted-foreground mt-1">
            Showing registered firearms for the last 6 months
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
