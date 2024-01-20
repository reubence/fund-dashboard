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
const boxPlotData = [
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.955467405347226,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.666224672428759,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.761121347615679,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.953660184375603,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.794832235318087,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.8996586991435045,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.915853458771313,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 7.0195016509371495,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 8.665837209215256,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 3.80527393228868,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 6.038479125020713,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.127621819877564,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.434325883615548,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.8314900535836856,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.532337660505537,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 3.6383550898274146,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.318797487308273,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 6.090910031326148,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.104846553690967,
  },
  {
    group: "Alpha",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.77300812577341,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 7.321403153972907,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.351951507009507,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.145491717079201,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.980561733583713,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 4.909230776473548,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 3.9112833740617052,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.882529380693864,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.557058673638143,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 7.560828569564915,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.885005981206282,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.527622884799198,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 7.130446799567893,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.1558474309721,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.794180213585841,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.752827863337064,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.851533200683517,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 7.497686770732511,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.946698868060569,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.667315852039828,
  },
  {
    group: "Alpha",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.04545125417244,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 8.253602767039727,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 8.35107370557588,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.244457058225187,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.346352699383612,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 8.3168987686734,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 9.453800936208166,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.963911748715431,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.842321350021716,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.6437499237534015,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 6.340518633853641,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 6.342653308831524,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 12.234489951137341,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 6.89883197167795,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 9.227992905599441,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.1784335723482275,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 8.41685823988113,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.823488776272515,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.524838960199268,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 7.037151848493689,
  },
  {
    group: "Beta",
    subgroup: "A",
    mu: 8,
    sd: 1.4,
    n: 20,
    value: 8.0903730213393,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.741137195654548,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.44786876452397,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 9.40130148499718,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.676576154142957,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.235394899365371,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.923299829251843,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.37905460722411,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.0741338152332105,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.976231794688413,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.66108964005627,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.401550775966342,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.66097959811449,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.506645225417945,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.279812137233945,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.428108377321957,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.5581097757700455,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.641349248428736,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 6.846672926418068,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 8.559870154450676,
  },
  {
    group: "Beta",
    subgroup: "B",
    mu: 7.5,
    sd: 1.4,
    n: 20,
    value: 7.718718809461257,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 2.6852174535514584,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.346869707915335,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.389730199958955,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.368645624332158,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.135480876404877,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 6.253382873856522,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.397835141456661,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.840846424754801,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.849870480476773,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.891111359524785,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.947098409910225,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.519679905630369,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.193038627067441,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.328406461677206,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.395970762735306,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 3.0653795790081086,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.329297996629493,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.992549355257548,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.9687160028393835,
  },
  {
    group: "Gamma",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.529388845495589,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 6.489422609156918,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 8.099808396313675,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 8.734262774884343,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 8.15075950948891,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.144736904743426,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 8.614679970874736,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.031371608702841,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 6.435353412563933,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.607020056126802,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 6.244263505678022,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.560028210541112,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 5.4890535728933845,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 8.069724510669968,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 9.513032019490193,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 4.699940077552549,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.452078964059399,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 7.158992395273542,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 4.683529589277735,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 4.728059900796598,
  },
  {
    group: "Gamma",
    subgroup: "B",
    mu: 7.2,
    sd: 1.8,
    n: 20,
    value: 6.67639903458249,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.399502725492552,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.892846186242946,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.710286413750045,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 6.134824458076411,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 3.974205506222525,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.825240377105741,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.404233302691777,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.952720759437853,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.994851191127255,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.697895836275129,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.468826843249463,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.031345584878226,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.835151142781528,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.584210531501755,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.468157109149203,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.632541448493416,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.153634074022986,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.500053247113041,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 4.967677863888405,
  },
  {
    group: "Delta",
    subgroup: "A",
    mu: 5,
    sd: 1,
    n: 20,
    value: 5.386075743921547,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.620896589730279,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.024785458118023,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.893445806419393,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.509936106063113,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.49720906239979,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 6.7991133653447315,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 7.204679681998547,
  },
  {
    group: "Delta",
    subgroup: "B",
    mu: 6,
    sd: 1,
    n: 20,
    value: 5.866041278171721,
  },
];
