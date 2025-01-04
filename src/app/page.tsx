"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function DiscordSummarizer() {
    const [channel, setChannel] = useState("")
    const [summaryType, setSummaryType] = useState("date")
    const [date, setDate] = useState<Date>()
    const [summary, setSummary] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically call your AI service to generate the summary
        // For this example, we'll just set a mock summary
        setSummary(`
# Summary for #${channel}

## Conversation 1: Project Updates
- Alice shared progress on the frontend redesign
- Bob mentioned backend optimizations are complete
- Team discussed potential launch date

## Conversation 2: Bug Triage
- Charlie reported a critical bug in the payment system
- Dave suggested a hotfix and will implement it today
- Team agreed to do a thorough review of the affected module

## Conversation 3: New Feature Ideas
- Eve proposed a new analytics dashboard
- Frank suggested integrating machine learning for predictive analytics
- Team decided to create a proposal for the next sprint planning
    `)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>S</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="channel">Select Channel</Label>
                        <Select value={channel} onValueChange={setChannel}>
                            <SelectTrigger id="channel">
                                <SelectValue placeholder="Select a channel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general">general</SelectItem>
                                <SelectItem value="random">random</SelectItem>
                                <SelectItem value="development">development</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <RadioGroup value={summaryType} onValueChange={setSummaryType} className="space-y-2">
                        <Label>Summary Type</Label>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="date" id="date" />
                            <Label htmlFor="date">From specific date</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="last-message" id="last-message" />
                            <Label htmlFor="last-message">From last message</Label>
                        </div>
                    </RadioGroup>

                    {summaryType === "date" && (
                        <div className="space-y-2">
                            <Label>Select Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}

                    <Button type="submit" className="w-full">Generate Summary</Button>
                </form>
            </CardContent>
            <CardFooter>
                {summary && (
                    <div className="w-full">
                        <h3 className="text-lg font-semibold mb-2">Generated Summary</h3>
                        <pre className="whitespace-pre-wrap bg-muted p-4 rounded-md overflow-auto max-h-96">
                            {summary}
                        </pre>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

