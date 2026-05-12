import { DynamicIcon, type IconName } from "lucide-react/dynamic"

interface CategoryIconProps {
    icon: string | null | undefined
    className?: string
    fallback?: string
}

const LUCIDE_NAME_RE = /^[a-z][a-z0-9-]*$/

export function CategoryIcon({ icon, className, fallback }: CategoryIconProps) {
    if (!icon) return <span className={className}>{fallback ?? ""}</span>
    if (LUCIDE_NAME_RE.test(icon)) {
        return <DynamicIcon name={icon as IconName} className={className} />
    }
    return <span className={className}>{icon}</span>
}
