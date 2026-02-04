import * as Icons from "lucide-react"
import { LucideProps } from "lucide-react"

interface IconProps {
    name?: string
    className?: string
}

export default function Icon({ name, className }: IconProps) {
    if (!name) return null

    const LucideIcon = Icons[name as keyof typeof Icons] as React.FC<LucideProps>

    if (!LucideIcon) return null

    return <LucideIcon className={className ?? "w-4 h-4"} />
}
