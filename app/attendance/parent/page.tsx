"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleCheckBig, CircleX, CircleSlash, ClockAlert } from "lucide-react"

export default function ParentDashboardPage() {
  const cards = [
    {
        title: "Days Present",
        value: "30",
        Icon: CircleCheckBig,
        iconClass: "text-green-500 dark:text-green-300"
    },
    {
        title: "Days Absent",
        value: "5",
        Icon: CircleX,
        iconClass: "text-red-500 dark:text-red-300"
    },
    {
        title: "Days Excused",
        value: "2",
        Icon: CircleSlash,
        iconClass: "text-indigo-500 dark:text-indigo-300"
    },
    {
        title: "Times Lates",
        value: "1",
        Icon: ClockAlert,
        iconClass: "text-red-500 dark:text-red-300",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
        {/* --- SINGLE SUMMARY CARDS --- */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cards.map(({ title, value, Icon, iconClass }, i) => (
            <Card key={i} className="h-43 rounded-3xl shadow-md border border-black">
                <CardHeader className="flex flex-row items-center justify-between px-6">
                <CardTitle className="text-xl font-bold">
                    {title}
                </CardTitle>
                {Icon && <Icon className={`h-6 w-6 ${iconClass}`} />}
                </CardHeader>

                <CardContent className="px-6 pb-6">
                <div className="font-bold text-4xl mb-1">
                    {value}
                </div>
                <div className="text-sm text-muted-foreground">
                    This Quarter
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
    </div>
    )
}