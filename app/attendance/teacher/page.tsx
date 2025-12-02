"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { CalendarIcon, Users, Funnel, ChevronDown } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";

export default function ParentDashboardPage() {
    const [selectedClassList, setSelectedClassList] = useState("Grade 7 - A");
    const [selectedStatusList, setSelectedStatusList] = useState("Present");
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [open, setOpen] = useState(false);

    const cards = [
        {
        title: "Date Selection",
        icon: CalendarIcon,
        iconClass: "text-red-500 dark:text-red-300",
        type: "date",
        },
        {
        title: "Class Selection",
        icon: Users,
        iconClass: "text-white",
        type: "class",
        },
        {
        title: "Status Filter",
        icon: Funnel,
        iconClass: "text-indigo-500 dark:text-indigo-300",
        type: "status",
        },
    ];

    const classList = [
        "Grade 7 - A", 
        "Grade 8 - A", 
        "Grade 9 - A", 
        "Grade 10 - A"
    ];
    const statusList = [
        "Present", 
        "Absent", 
        "Excused", 
        "Late"
    ];

    return (
        <div className="flex flex-col gap-6 p-4 text-foreground">
            {/*CARDS */}
            <div className="grid auto-rows-min gap-4 md:grid-cols-3 lg:grid-cols-3">
                {cards.map(({ title, icon: Icon, iconClass, type }, i) => (
                    <Card
                        key={i}
                        className="rounded-3xl bg-card border border-neutral-700 shadow-lg"
                    >
                    <CardHeader className="flex flex-row items-center justify-between px-6 pt-4">
                        <CardTitle className="text-xl font-bold">{title}</CardTitle>
                        <Icon className={`h-6 w-6 ${iconClass}`} />
                    </CardHeader>

                    <CardContent className="flex justify-center pb-6 pt-4">
                        {/* --- DATE SELECTOR --- */}
                        {type === "date" && (
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-90 justify-between text-left rounded-xl border border-neutral-600 bg-transparent text-white"
                                    >
                                        {date ? date.toLocaleDateString() : "Select date"}
                                        <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => {
                                            setDate(d);
                                            setOpen(false);
                                        }}
                                        captionLayout="dropdown"
                                        />
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* --- CLASS SELECTOR --- */}
                        {type === "class" && (
                            <Select
                                value={selectedClassList}
                                onValueChange={setSelectedClassList}
                            >
                                <SelectTrigger
                                    className="w-90 rounded-xl border border-neutral-600 bg-transparent text-white"
                                >
                                    <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-neutral-900">
                                    {classList.map((cl) => (
                                        <SelectItem key={cl} value={cl}>
                                            {cl}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {/* --- STATUS FILTER --- */}
                        {type === "status" && (
                            <Select
                                value={selectedStatusList}
                                onValueChange={setSelectedStatusList}
                            >
                                <SelectTrigger
                                    className="w-90 rounded-xl border border-neutral-600 bg-transparent text-white"
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-neutral-900">
                                    {statusList.map((st) => (
                                        <SelectItem key={st} value={st}>
                                            {st}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
