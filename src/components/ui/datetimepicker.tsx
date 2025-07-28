import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Loader2, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // optional if you use toasts

export function DateTimePickerWithValidation({
  memberId,
  initialDate,
}: {
  memberId: string;
  initialDate?: Date;
}) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

    React.useEffect(() => {
    const fetchAppointmentDate = async () => {
        try {
        const res = await fetch(`${API_URL}/api/members/get-appointment/${memberId}`);
        const data = await res.json();
        console.log("Member ID:", memberId);

        if (res.ok && data?.appointmentDate) {
            const fetchedDate = new Date(data.appointmentDate);

            setDate(fetchedDate); // Set to state
            const hours = fetchedDate.getHours().toString().padStart(2, "0");
            const minutes = fetchedDate.getMinutes().toString().padStart(2, "0");
            setTime(`${hours}:${minutes}`);
            console.log("Fetched date:", fetchedDate);
        }
        } catch (err) {
        console.error("Failed to fetch appointment:", err);
        }
    };

    fetchAppointmentDate();
    }, [memberId]);
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTime(value);
    if (date && value) {
      const [hours, minutes] = value.split(":").map(Number);
      const updatedDate = new Date(date);
      updatedDate.setHours(hours);
      updatedDate.setMinutes(minutes);
      setDate(updatedDate);
    }
  };

  const handleValidate = async () => {

    if (!date || !time) return alert("Please select both date and time.");

    console.log(date.toISOString()); // always shows UTC time
    console.log(date.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })); // local

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/members/update-appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          appointmentDate: date,
        }),
      });

      const data = await res.json();
      console.log("Validate Data:",data.appointmentDate);
      if (!res.ok) throw new Error(data.message || "Failed to update.");

      toast.success("Appointment date saved!");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  const handleClear = () => {
    setDate(undefined);
    setTime("");
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("justify-start text-left", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMMM do, yyyy '@' h:mm a") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto flex items-center">
            <Calendar
            className="rounded-lg border h-auto w-auto border-neutral-200 bg-white p-0 text-sm shadow-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
                if (!selectedDate) return;
                if (time) {
                const [hours, minutes] = time.split(":").map(Number);
                selectedDate.setHours(hours);
                selectedDate.setMinutes(minutes);
                }
                setDate(selectedDate);
            }}
            initialFocus
            />
          <Input className="mt-0" type="time" value={time} onChange={handleTimeChange} />
          <Button
            onClick={handleValidate}
            disabled={isLoading}
            className="mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </>
            )}
          </Button>
        </PopoverContent>
      </Popover>

      {/* Cancel / Clear Button */}
      {date && (
        <Button variant="ghost" size="icon" onClick={handleClear}>
          <X className="h-4 w-4 text-red-500" />
        </Button>
      )}
    </div>
  );
}
