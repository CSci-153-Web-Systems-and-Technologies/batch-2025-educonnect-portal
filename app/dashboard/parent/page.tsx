"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, UserCheck, MessageSquare, Calendar, CircleDot } from "lucide-react"

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

  const recentMessages = [
    {
      teacher: "Ms. Rodriguez",
      subject: "Grade Concern",
      time: "1 days ago",
    },
    {
      teacher: "Mr. Zafico",
      subject: "Field Trip Permission",
      time: "2 days ago",
    },
    {
      teacher: "Mrs. Duterte",
      subject: "Science Project Update",
      time: "3 days ago",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">
        {/* --- SINGLE SUMMARY CARDS --- */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cards.map((c, i) => (
                <Card
                    key={i}
                    className="h-57 rounded-3xl shadow-md border border-border bg-card transition-colors"
                >
                    <CardHeader className="flex flex-row items-center justify-between px-6">
                        <CardTitle className="text-xl font-bold">{c.title}</CardTitle>
                        {c.Icon && (
                            <c.Icon className={`h-6 w-6 ${c.iconClass} dark:opacity-90`} />
                        )}
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                        <div className="font-bold text-4xl mb-1">{c.value}</div>
                        {c.subtext && (
                            <p className="text-xs text-muted-foreground mb-5">
                            {c.subtext}
                            </p>
                        )}

                        <Button
                            className="
                            border border-border 
                            w-full h-11 rounded-full 
                            bg-muted text-foreground font-normal shadow-sm
                            hover:bg-primary hover:text-primary-foreground 
                            transition
                            "
                            variant="ghost"
                        >
                            {c.buttonText}
                        </Button>
                    </CardContent>
                </Card>
            ))}
            
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* --- RECENT MESSAGES --- */}
            <Card className="rounded-3xl shadow-md border border-border bg-card">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold">Recent Messages</CardTitle>
                            <p className="text-sm text-muted-foreground">
                            Latest communications from teachers
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="
                            rounded-full shadow 
                            bg-background border border-border px-4 
                            hover:bg-muted transition
                            "
                            variant="outline"
                        >
                            View All
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                    {recentMessages.map((m, i) => (
                        <div
                            key={i}
                            className="
                            flex items-center justify-between 
                            border border-border rounded-2xl px-4 py-3 shadow-sm
                            bg-card
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div className="
                                    w-10 h-10 rounded-full border border-border 
                                    flex items-center justify-center bg-muted 
                                ">
                                    <span className="text-muted-foreground">👤</span>
                                </div>
                                <div>
                                        <p className="font-semibold">{m.teacher}</p>
                                        <p className="text-sm text-muted-foreground">{m.subject}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">{m.time}</p>
                                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                                    New
                                </span>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
        </div>

        
    </div>
  )
}
