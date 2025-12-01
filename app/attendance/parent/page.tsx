"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleCheckBig, CircleX, CircleSlash, ClockAlert } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

export default function ParentDashboardPage() {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const weeks = [
        "1st Week",
        "2nd Week",
        "3rd Week",
        "4th Week",
        "5th Week"
    ]

    // --- AUTO DETECT CURRENT MONTH AND WEEK ---
    const today = new Date()
    const currentMonth = months[today.getMonth()]
    const currentWeek = Math.ceil(today.getDate() / 7) + "st Week"

    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedWeek, setSelectedWeek] = useState(currentWeek)
    const cards = [
        {
            title: "Days Present",
            value: "30",
            Icon: CircleCheckBig,
            iconClass: "text-green-500 dark:text-green-300",
        },
        {
            title: "Days Absent",
            value: "5",
            Icon: CircleX,
            iconClass: "text-red-500 dark:text-red-300",
        },
        {
            title: "Days Excused",
            value: "2",
            Icon: CircleSlash,
            iconClass: "text-indigo-500 dark:text-indigo-300",
        },
        {
            title: "Times Lates",
            value: "1",
            Icon: ClockAlert,
            iconClass: "text-red-500 dark:text-red-300",
        },
    ]

    const attendance = [
        {
            day: "Monday",
            date: "09 / 22 / 25",
            timeIn: "8:15 AM",
            timeOut: "3:30 PM",
            status: "Present",
            statusVariant: "secondary",
            notes: "-",
        },
        {
            day: "Tuesday",
            date: "09 / 23 / 25",
            timeIn: "8:15 AM",
            timeOut: "1:00 PM",
            status: "Early Release",
            statusVariant: "outline",
            notes: "Sick",
        },
        {
            day: "Wednesday",
            date: "09 / 24 / 25",
            timeIn: "9:00 AM",
            timeOut: "3:30 PM",
            status: "Late",
            statusVariant: "destructive",
            notes: "-",
        },
        {
            day: "Thursday",
            date: "09 / 25 / 25",
            timeIn: "-",
            timeOut: "-",
            status: "Absent",
            statusVariant: "destructive",
            notes: "Excuse Letter",
        },
        {
            day: "Friday",
            date: "09 / 26 / 25",
            timeIn: "-",
            timeOut: "-",
            status: "Excuse",
            statusVariant: "secondary",
            notes: "-",
        },
    ] as const

    return (
        <div className="flex flex-col gap-6 p-4 text-foreground">
        {/* --- SUMMARY CARDS --- */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-4">
            {cards.map(({ title, value, Icon, iconClass }, i) => (
            <Card 
                key={i} 
                className="h-43 rounded-3xl shadow-md border border-black dark:border-none bg-card">
                <CardHeader className="flex flex-row items-center justify-between px-6">
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
                {Icon && <Icon className={`h-6 w-6 ${iconClass}`} />}
                </CardHeader>

                <CardContent className="px-6 pb-6">
                <div className="font-bold text-4xl mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">This Quarter</div>
                </CardContent>
            </Card>
            ))}
        </div>

        {/* ATTENDANCE DETAILS */}
        <Card className="border border-black dark:border-none rounded-3xl shadow-md">
            <CardHeader className="px-7">
            <div className="flex items-start justify-between w-full">
                
                {/* TITLE + DESCRIPTION */}
                <div>
                <CardTitle className="text-xl font-bold">Attendance Details</CardTitle>
                <CardDescription>Daily attendance records</CardDescription>
                </div>

                {/* RIGHT SIDE DROPDOWNS */}
                <div className="flex gap-3">

                {/* MONTH SELECT */}
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className=" 
                    border border-black dark:border-neutral-700
                    text-black dark:text-white
                    rounded-xl
                    ">
                    <SelectValue placeholder="Month" />
                    </SelectTrigger>

                    <SelectContent className="
                    text-center border border-black dark:border-neutral-700
                    dark:bg-neutral-900 dark:text-white
                    ">
                    {months.map((m) => (
                        <SelectItem value={m} key={m} className="text-center">
                        {m}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                {/* WEEK SELECT */}
                <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                    <SelectTrigger className="
                    
                    border border-black dark:border-neutral-700
                    text-black dark:text-white
                    rounded-xl
                    ">
                    <SelectValue placeholder="Week" />
                    </SelectTrigger>

                    <SelectContent className="
                    text-center border border-black dark:border-neutral-700
                    dark:bg-neutral-900 dark:text-white
                    ">
                    {weeks.map((w) => (
                        <SelectItem value={w} key={w} className="text-center">
                        {w}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>

                </div>
            </div>
            </CardHeader>

            <CardContent>
            <Table>
                <TableHeader>
                <TableRow className="border-b border-black dark:border-neutral-700">
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Day</TableHead>
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Date</TableHead>
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Time In</TableHead>
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Time Out</TableHead>
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Status</TableHead>
                    <TableHead className="text-lg border-b border-black dark:border-neutral-700">Notes</TableHead>
                </TableRow>
                </TableHeader>

                <TableBody>
                {attendance.map((row, i) => (
                    <TableRow key={i} className="border-b border-black dark:border-neutral-700">
                    <TableCell className="border-b border-black dark:border-neutral-700">{row.day}</TableCell>
                    <TableCell className="border-b border-black dark:border-neutral-700">{row.date}</TableCell>
                    <TableCell className="border-b border-black dark:border-neutral-700">{row.timeIn}</TableCell>
                    <TableCell className="border-b border-black dark:border-neutral-700">{row.timeOut}</TableCell>
                    <TableCell className="border-b border-black dark:border-neutral-700">
                        <Badge variant={row.statusVariant} className="text-xs">
                        {row.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="border-b border-black dark:border-neutral-700">{row.notes}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        </div>
    )
}
