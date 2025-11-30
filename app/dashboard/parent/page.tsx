"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, UserCheck, MessageSquare, Calendar, CircleAlert, User } from "lucide-react"

export default function ParentDashboardPage() {
  const cards = [
    {
        title: "Grades",
        value: "89.60%",
        subtext: "Current Quarter Average",
        Icon: TrendingUp,
        iconClass: "text-indigo-500 dark:text-indigo-400",
        buttonText: "View Details",
    },
    {
        title: "Attendance",
        value: "90%",
        subtext: "This Quarter",
        Icon: UserCheck,
        iconClass: "text-green-700 dark:text-green-400",
        buttonText: "View Records",
    },
    {
        title: "Unread Messages",
        value: "2",
        subtext: "From Teachers",
        Icon: MessageSquare,
        iconClass: "text-blue-500 dark:text-blue-400",
        buttonText: "Read Messages",
    },
    {
        title: "Upcoming Events",
        value: "1",
        subtext: "This Month",
        Icon: Calendar,
        iconClass: "text-red-500 dark:text-red-400",
        buttonText: "View Events",
    },
  ]

  const recentMessages = [
    { 
        teacher: "Ms. Rodriguez", 
        subject: "Grade Concern", 
        time: "1 day ago" 
    },
    { 
        teacher: "Mr. Zafico", 
        subject: "Field Trip Permission", 
        time: "2 days ago" 
    },
    { 
        teacher: "Mrs. Duterte", 
        subject: "Science Project Update", 
        time: "3 days ago" 
    },
  ]

  const events = [
    { 
        title: "GPTA Meeting", 
        date: "September 20", 
        color: "bg-blue-500", 
        tag: "Meeting" },
    { 
        title: "Science Fair", 
        date: "September 25", 
        color: "bg-green-500", 
        tag: "Event" 
    },
    { 
        title: "Bonifacio Day", 
        date: "November 30", 
        color: "bg-red-500", 
        tag: "Holiday" 
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4 text-foreground">

        {/* --- TOP SUMMARY CARDS --- */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cards.map(({ title, value, subtext, Icon, buttonText, iconClass }, i) => (
                <Card
                    key={i}
                    className="h-57 rounded-3xl shadow-sm border border-black dark:border-none bg-card"
                >
                    <CardHeader className="flex flex-row items-center justify-between px-6">
                    <CardTitle className="text-xl font-bold">{title}</CardTitle>
                    {Icon && <Icon className={`h-6 w-6 ${iconClass}`} />}
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                        <div className="font-bold text-4xl mb-1">{value}</div>
                        {subtext && (
                            <p className="text-xs text-muted-foreground mb-5">{subtext}</p>
                        )}

                        <Button
                            variant="ghost"
                            className="
                            border border-black dark:border-none w-full h-11 rounded-full
                            bg-muted text-foreground 
                            hover:bg-foreground hover:text-background 
                            transition"
                        >
                            {buttonText}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* --- RECENT MESSAGES --- */}
        <Card className="rounded-3xl shadow-sm border border-black dark:border-none bg-card">
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
                        variant="ghost"
                        className="rounded-full bg-background border border-black dark:border-none px-4 hover:bg-foreground hover:text-background transition"
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
                    border border-black dark:border-none rounded-2xl px-4 py-3 shadow-sm bg-card
                    "
                >
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full border border-black dark:border-none flex items-center justify-center bg-muted">
                            <User className="h-4 w-4 text-black dark:text-white flex items-center justify-center " />
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

        {/* --- UPCOMING EVENTS --- */}
        <Card className="rounded-3xl shadow-sm border border-black dark:border-none bg-card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Upcoming Events</CardTitle>
                        <p className="text-sm text-muted-foreground">
                        School calendar and important dates
                        </p>
                    </div>

                    <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full bg-background border border-black dark:border-none px-4 hover:bg-foreground hover:text-background transition"
                    >
                        View All
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                {events.map((e, i) => (
                    <div
                        key={i}
                        className="
                        flex items-center justify-between 
                        border border-black dark:border-none rounded-2xl px-4 py-3 shadow-sm bg-card"
                    >
                        <div className="flex items-center gap-3">
                            <span className={`w-4 h-4 rounded-full ${e.color}`}></span>
                            <div>
                                <p className="font-semibold">{e.title}</p>
                                <p className="text-sm text-muted-foreground">{e.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-background border border-black dark:border-none px-3 py-1 rounded-full">
                                {e.tag}
                            </span>
                            <CircleAlert className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>

      </div>
    </div>
  )
}
