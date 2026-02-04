import * as Icons from "lucide-react"

interface IconProps {
    name: string
    className?: string
}

export default function Icon({ name, className }: IconProps) {
    const LucideIcon = (Icons as any)[name]

    if (!LucideIcon) return null

    return <LucideIcon className={className ?? "w-4 h-4"} />
}
