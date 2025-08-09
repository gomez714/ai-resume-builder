import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
    loading: boolean;
}

export default function LoadingButton({ loading, disabled, className,  ...props }: LoadingButtonProps) {
    return <Button {...props} disabled={loading || disabled} 
    className={cn("flex items-center gap-2", className)}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {props.children}
    </Button>
}