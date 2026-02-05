import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

export function DeliveryLocationDialog() {
    const { pincode, setPincode } = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [localPincode, setLocalPincode] = useState(pincode);

    const handleSave = () => {
        setPincode(localPincode);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-muted-foreground hover:text-primary">
                    <MapPin size={16} />
                    <span className="text-sm truncate max-w-[120px]">
                        {pincode ? `Deliver to ${pincode}` : "Select Location"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Delivery Location</DialogTitle>
                    <DialogDescription>
                        Enter your Pincode to check delivery availability and options.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pincode" className="text-right">
                            Pincode
                        </Label>
                        <Input
                            id="pincode"
                            value={localPincode}
                            onChange={(e) => setLocalPincode(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. 400001"
                            maxLength={6}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
