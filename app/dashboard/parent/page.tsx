"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, UserCheck, MessageSquare, Calendar} from "lucide-react"

export default function ParentDashboardPage() {
  const cards = [
    {
      title: "Grades",
      value: "89.60%",
      subtext: "Current Quarter Average",
      Icon: TrendingUp,
      iconClass: "text-indigo-500",
      buttonText: "View Details",
    },
    {
      title: "Attendance",
      value: "90%",
      subtext: "This Quarter",
      Icon: UserCheck,
      iconClass: "text-green-500",
      buttonText: "View Records",
    },
    {
      title: "Unread Messages",
      value: "2",
      subtext: "From Teachers",
      Icon: MessageSquare,
      iconClass: "text-blue-500",
      buttonText: "Read Messages",
    },
    {
      title: "Upcoming Events",
      value: "1",
      subtext: "This Month",
      Icon: Calendar,
      iconClass: "text-red-500",
      buttonText: "Read Messages",
    },
  ]


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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

        <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  )
}
