"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "../feedback/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export default function AdminCharts({ trendData = [], statusData = [] }) {
  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Tren kejadian</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          {trendData.length ? (
            <div className="h-64 min-w-0" role="img" aria-label="Grafik tren kejadian">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#e7ece8" vertical={false} />
                  <XAxis axisLine={false} dataKey="label" tickLine={false} tick={{ fill: "#64776f", fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64776f", fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#174a3a" maxBarSize={38} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="Belum ada tren"
              description="Grafik akan tampil setelah data rekap tersedia."
            />
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Komposisi status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-4 sm:p-5">
          {statusData.length ? (
            <>
              <div className="h-52 w-full min-w-0" role="img" aria-label="Grafik komposisi status">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="jumlah"
                      nameKey="label"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                    >
                      {statusData.map((item, index) => (
                        <Cell fill={item.warna ?? ["#174a3a", "#77ad72", "#ef7045", "#d8a443"][index % 4]} key={`${item.label}-${index}`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="m-0 flex w-full flex-wrap justify-center gap-x-5 gap-y-2 p-0 text-xs text-[#40574d]">
                {statusData.map((item, index) => (
                  <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
                    <span
                      aria-hidden="true"
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: item.warna ?? ["#174a3a", "#77ad72", "#ef7045", "#d8a443"][index % 4] }}
                    />
                    {item.label}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="Belum ada komposisi"
              description="Distribusi status akan tampil setelah data rekap tersedia."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}