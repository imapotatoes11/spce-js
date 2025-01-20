"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, DeleteIcon, Trash2Icon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2 } from "lucide-react"
import Karchdown from "@/components/Karchdown"
import NeoKarchdown from "@/components/NeoKarchdown"
import { AnimatePresence, motion } from "motion/react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function DiscordSummarizer() {
    const [channel, setChannel] = useState("")
    const [summaryType, setSummaryType] = useState("date")
    const [date, setDate] = useState<Date>()
    const [summary, setSummary] = useState("nil")
    const [username, setUsername] = useState("imapotatoes11")

    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setSummary("")
        switch (summaryType) {
            case "date":
                try {
                    if (!date) {
                        setSummary("No date selected")
                        setLoading(false)
                        return
                    }
                    // setSummary(`date: ${format(date, "PPP")}, channel: ${channel}`)
                    // setSummary(`date: ${format(date, "PPP")}, channel: ${channel}, ${format(date, 'MM-dd-yyyy')}`)
                    ///////////////////////////////////////////////////////////////
                    const res = await fetch('/api/byDate', {
                        method: 'POST',
                        body: JSON.stringify({
                            selectedDate: format(date, "MM-dd-yyyy"),
                            channel: channel
                        })
                    });
                    // setSummary(`posting to /api/byDate body ${JSON.stringify({ date: format(date, "MM-dd-yyyy") })}`)

                    const reader = res.body?.getReader();
                    if (!reader) return;

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        const text = new TextDecoder().decode(value).replace(/\n/g, '<br>');
                        setSummary((prev) => prev + text);
                    }
                    ///////////////////////////////////////////////////////////////
                    setLoading(false)
                } catch (error) {
                    setSummary("Invalid date")
                    setLoading(false)
                }
                break
            case "last-message":
                // setSummary(`last-message: ${channel}`)
                ////////////////////////////////////////////////////////////////
                const res = await fetch('/api/byUsername', {
                    method: 'POST',
                    body: JSON.stringify({
                        username: username,
                        channel: channel
                    })
                });

                const reader = res.body?.getReader();
                if (!reader) return;

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    const text = new TextDecoder().decode(value).replace(/\n/g, '<br>');
                    setSummary((prev) => prev + text);
                }
                ///////////////////////////////////////////////////////////////
                setLoading(false)
                break
        }
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
                                <SelectItem value="woment">Women't</SelectItem>
                                <SelectItem value="beans">Beans</SelectItem>
                                <SelectItem value="beans2">Beans but with rian</SelectItem>
                                {/* <SelectItem value="random">random</SelectItem>
                                <SelectItem value="development">development</SelectItem> */}
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

                    {summaryType === "last-message" && (
                        <div className="space-y-2">
                            <Label htmlFor="username">Select a User</Label>
                            <Select value={username} onValueChange={setUsername}>
                                <SelectTrigger id="username">
                                    <SelectValue placeholder="Select a User" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="imapotatoes11">kevin</SelectItem>
                                    <SelectItem value="piano201">rian</SelectItem>
                                    <SelectItem value="_no.u">alex</SelectItem>
                                    <SelectItem value="jmstng">tung</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="w-full flex flex-row gap-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : ""}
                            Generate Summary
                        </Button>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button type="button" className="w-fit"
                                        onClick={(e) => { e.preventDefault(); setSummary("nil"); setLoading(false) }}
                                    ><Trash2Icon /></Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Clear Response</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <AnimatePresence>
                    {(summary !== 'nil') && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.25, opacity: 0 }}
                            transition={{ duration: 0.5, type: "easeOut" }}
                            className="w-full"
                        >
                            <h3 className="text-2xl font-semibold mb-2">Generated Summary</h3>
                            <NeoKarchdown raw={summary} loading={loading} className="" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardFooter>
        </Card>
    )
}

