"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { TrendingUp, Award, MessageSquare, Calendar, Trophy, Medal, GraduationCap, Users } from "lucide-react"

export default function DashboardPage() {
  const cards = [
    { 
      title: "Total Students", 
      value: "96", 
      subtext: "Across all sections", 
      Icon: TrendingUp, 
      buttonText: "View Details",
      iconClass: "text-indigo-500 dark:text-indigo-400"
    },
    { 
      title: "Honor Students", 
      value: "46", 
      subtext: "This Quarter", 
      Icon: Award, 
      buttonText: "View Details",
      iconClass: "text-yellow-500 dark:text-yellow-400"

    },
    { 
      title: "Unread Messages", 
      value: "2", 
      subtext: "From Parents", 
      Icon: MessageSquare, 
      buttonText: "Read Messages",
      iconClass: "text-blue-500 dark:text-blue-400"
    },
    { 
      title: "Upcoming Events", 
      value: "1", 
      subtext: "This Month", 
      Icon: Calendar, 
      buttonText: "View Details",
      iconClass: "text-red-500 dark:text-red-400"
    }
  ]
    const recognition = [
    {
      title: "Highest Honor",
      value: 8,
      range: "98% - 100%",
      icon: Trophy,
      bg: "bg-yellow-100 dark:bg-yellow-900/40",
      iconColor: "text-yellow-500 dark:text-yellow-400"
    },
    {
      title: "High Honors",
      value: 15,
      range: "95% - 97%",
      icon: Medal,
      bg: "bg-indigo-200 dark:bg-indigo-900/40",
      iconColor: "text-indigo-500 dark:text-indigo-400"
    },
    {
      title: "Honors",
      value: 23,
      range: "90% - 94%",
      icon: GraduationCap,
      bg: "bg-green-200 dark:bg-green-900/40",
      iconColor: "text-green-700 dark:text-green-400"
    },
    {
      title: "Other Students",
      value: 50,
      range: "Below 90%",
      icon: Users,
      bg: "bg-gray-300 dark:bg-gray-800",
      iconColor: "text-gray-700 dark:text-gray-300"
    }
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">

      {/* --- SINGLE SUMMARY CARDS --- */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cards.map(({ title, value, subtext, Icon, buttonText, iconClass }, i) => (
          <Card key={i} className="h-57 rounded-3xl shadow-md border border-black">
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
              {subtext && (<p className="text-xs text-muted-foreground mb-5">{subtext}</p>)}
              {buttonText && (
                <Button className="border border-border w-full h-11 rounded-full
                    bg-muted text-foreground shadow-sm hover:bg-foreground hover:text-background transition "variant="ghost">
                  {buttonText}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- ACADEMIC RECOGNITION SUMMARY --- */}
      <Card className="w-full rounded-3xl border-black px-8 py-6 shadow-md ">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Academic Recognition Summary
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Students eligible for honor based on current performance
          </p>
        </CardHeader>

        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

          {recognition.map((item, i) => (
            <div
              key={i}
              className={`${item.bg} rounded-3xl border border-border shadow-sm p-6 flex flex-col items-center text-center`}
            >
              <item.icon className={`h-10 w-10 mb-2 ${item.iconColor}`} />
              <div className="text-4xl font-bold">
                {item.value}
              </div>
              <div className="text-lg font-semibold mt-1">
                {item.title}
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                {item.range}
              </p>
            </div>
          ))}

        </CardContent>
      </Card>
      
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}