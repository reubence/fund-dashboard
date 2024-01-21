import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { NextApiResponse } from "next";
import React from "react";

export function BoxPlotChart() {
  const [data, setData] = React.useState<any[]>([]); // Update the type of data to be an array
  const [error, setError] = React.useState<Error>();
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchBoxPlotData = async () => {
    const backtestId = "12c9d129-3fef-4aba-9109-9921b667b218";
    const url = `https://eventhorizonfund.net/api/dashboard/backtest/get_box_plot_data/?backtest_id=${backtestId}`;

    setIsLoading(true);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const dataForBoxPlot = transformData(result);

      setData(dataForBoxPlot);
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBoxPlotData();
  }, []);

  if (isLoading)
    return <div className="ml-8 -mt-4 h-screen w-full">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);
  return (
    <div className="-mt-14 h-[93dvh] w-full">
      <ResponsiveBoxPlot
        data={data}
        margin={{ top: 60, right: 140, bottom: 60, left: 60 }}
        minValue={-500}
        maxValue={900}
        subGroupBy="subgroup"
        padding={0.12}
        enableGridX={true}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 36,
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "",
          legendOffset: 0,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "group",
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "value",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        colors={{ scheme: "nivo" }}
        borderRadius={2}
        borderWidth={2}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        medianWidth={2}
        medianColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        whiskerEndSize={0.6}
        whiskerColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        motionConfig="stiff"
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemWidth: 60,
            itemHeight: 20,
            itemsSpacing: 3,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            symbolSize: 20,
            symbolShape: "square",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

// Helpers function to calculate statistics
function calculateStatistics(values: number[]) {
  const n = values.length;
  const mean = values.reduce((acc, val) => acc + val, 0) / n;
  const variance = values.reduce((acc, val) => acc + (val - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  const sortedValues = [...values].sort((a, b) => a - b);
  const median = sortedValues[Math.floor(n / 2)];
  return { mu: mean, sd: sd, n: n, value: median };
}

// Function to transform the data
function transformData(apiResponse: NextApiResponse) {
  const transformedData = [];

  // Process each group in the apiResponse
  for (const [group, { x: subgroups, y: values }] of Object.entries(
    apiResponse
  )) {
    // Process each subgroup and its corresponding values
    for (let i = 0; i < subgroups.length; i++) {
      const subgroup = subgroups[i];
      const subgroupValues = values[i];

      // Calculate statistics for each subgroup
      const stats = calculateStatistics(
        Array.isArray(subgroupValues) ? subgroupValues : [subgroupValues]
      );

      // Push the transformed data for this subgroup
      transformedData.push({
        group,
        subgroup,
        ...stats,
      });
    }
  }

  return transformedData;
}
