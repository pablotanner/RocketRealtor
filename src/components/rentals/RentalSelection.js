import {useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover.tsx";
import {Button} from "../ui/button.tsx";
import {Command,CommandEmpty, CommandGroup, CommandInput, CommandItem} from "../ui/command.tsx";
import {Check, ChevronDown} from "lucide-react";
import {useGetUnitsQuery} from "../../services/api/unitApi.js";
import {cn} from "../../utils.ts";


const RentalSelection = ({onSelect, selected}) => {
    const [open, setOpen] = useState(false)
    const [unitId, setUnitId] = useState(selected)

    const {data: units, isLoading} = useGetUnitsQuery()

    if (isLoading) {
        return null
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between capitalize"
                >
                    {unitId
                        ? "Unit " + units?.data?.find((unit) => unit.id === parseInt(unitId))?.id
                        : "Select Unit..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command >
                    <CommandInput placeholder="Search Unit" />
                    <CommandEmpty>No Unit found.</CommandEmpty>
                    <CommandGroup>
                        {units?.data?.map((unit) => (
                            <CommandItem
                                key={unit.id}
                                value={unit.id}
                                onSelect={(currentValue) => {
                                    setUnitId(currentValue === unitId ? null : currentValue)
                                    onSelect(currentValue === unitId ? null : currentValue)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        parseInt(unitId) === unit.id ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {unit.id}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )

}

export default RentalSelection;