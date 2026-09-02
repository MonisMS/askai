import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const MeetingsSearchFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();
    const [value, setValue] = useState(filters.search);

    // keep the input in step when filters are cleared elsewhere
    useEffect(() => {
        setValue(filters.search);
    }, [filters.search]);

    useEffect(() => {
        if (value === filters.search) return;
        const timeout = setTimeout(() => {
            setFilters({ search: value, page: DEFAULT_PAGE });
        }, 300);
        return () => clearTimeout(timeout);
    }, [value, filters.search, setFilters]);

    return (
        <div className="relative">
            <Input
            placeholder="Filter meetings by name"
            className="h-9 bg-background w-[200px] pl-8"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            />

            <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}
