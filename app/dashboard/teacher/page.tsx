"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { TrendingUp, Award, MessageSquare, Calendar } from "lucide-react"

export default function DashboardPage() {
  const cards: {
    title: string
    value: string | number
    subtext?: string
    Icon?: any
    buttonText?: string
    iconClass?: string
  }[] = [
    { 
      title: "Total Students", 
      value: "96", 
      subtext: "Across all sections", 
      Icon: TrendingUp, 
      buttonText: "View Details",
      iconClass: "text-indigo-500"
    },
    { 
      title: "Honor Students", 
      value: "46", 
      subtext: "This Quarter", 
      Icon: Award, 
      buttonText: "View Details",
      iconClass: "text-yellow-500"

    },
    { 
      title: "Unread Messages", 
      value: "2", 
      subtext: "From Parents", 
      Icon: MessageSquare, 
      buttonText: "Read Messages",
      iconClass: "text-blue-500"
    },
    { 
      title: "Upcoming Events", 
      value: "1", 
      subtext: "This Month", 
      Icon: Calendar, 
      buttonText: "View Details",
      iconClass: "text-red-500"
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map(({ title, value, subtext, Icon, buttonText, iconClass }, i) => (
          <Card key={i} className="h-57 rounded-3xl shadow-md border border-black">
            <CardHeader className="flex flex-row items-center justify-between px-6">
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {Icon ? <Icon className={`h-6 w-6 ${iconClass}`} /> : null}
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <div className="font-bold text-4xl mb-1">{value}</div>
              {subtext ? <p className="text-xs text-muted-foreground mb-5">{subtext}</p> : null}
              {buttonText ? (
                <Button
                className="border border-gray-300 w-full h-11 rounded-full bg-[#ededed] max-w-full text-black font-normal shadow-sm hover:bg-black transition hover:text-white"
                  variant="ghost">
              {buttonText}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}