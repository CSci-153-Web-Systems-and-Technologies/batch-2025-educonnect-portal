"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { LucideIcon, ChevronDown } from "lucide-react";

export interface FilterItem {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor: string; // e.g., "text-red-500"
  type: "select" | "date";
  value: any;
  onChange: (val: any) => void;
  options?: string[]; // For selects
}

interface FilterBarProps {
  filters: FilterItem[];
}

export function FilterBar({ filters }: FilterBarProps) {
  return (
    <div className={`grid auto-rows-min gap-4 md:grid-cols-${filters.length}`}>
      {filters.map((filter) => (
        <Card 
          key={filter.id} 
          className="rounded-3xl bg-white dark:bg-neutral-900 border border-black dark:border-transparent shadow-lg"
        >
          <CardHeader className="flex flex-row items-center justify-between px-6 pt-4">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {filter.title}
            </CardTitle>
            <filter.icon className={`h-6 w-6 ${filter.iconColor}`} />
          </CardHeader>
          <CardContent className="flex justify-center pb-6 pt-4">
            
            {/* --- DATE PICKER --- */}
            {filter.type === "date" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between rounded-xl border-black dark:border-neutral-700 bg-transparent"
                  >
                    {filter.value ? filter.value.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : "Select date"} 
                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={filter.value} onSelect={filter.onChange} />
                </PopoverContent>
              </Popover>
            )}

            {/* --- SELECT DROPDOWN --- */}
            {filter.type === "select" && (
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="w-full rounded-xl border-black dark:border-neutral-700 bg-transparent">
                  <SelectValue placeholder={`Select ${filter.title}`} />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-900">
                  {filter.options?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt === " " ? "None" : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

          </CardContent>
        </Card>
      ))}
    </div>
  );
}