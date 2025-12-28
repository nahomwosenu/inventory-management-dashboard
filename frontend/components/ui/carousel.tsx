import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselProps = {
    autoplay?: boolean
    delay?: number
    loop?: boolean
    className?: string
    children: React.ReactNode
}

export function Carousel({
    autoplay = false,
    delay = 4000,
    loop = true,
    className,
    children,
}: CarouselProps) {
    const autoplayPlugin = React.useMemo(
        () =>
            autoplay
                ? Autoplay({
                    delay,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                })
                : undefined,
        [autoplay, delay]
    )

    const [viewportRef, embla] = useEmblaCarousel(
        {
            loop,
            align: "start",
            containScroll: "trimSnaps",
        },
        autoplayPlugin ? [autoplayPlugin] : []
    )

    const [canPrev, setCanPrev] = React.useState(false)
    const [canNext, setCanNext] = React.useState(false)

    const updateButtons = React.useCallback(() => {
        if (!embla) return
        setCanPrev(embla.canScrollPrev())
        setCanNext(embla.canScrollNext())
    }, [embla])

    React.useEffect(() => {
        if (!embla) return
        updateButtons()
        embla.on("select", updateButtons)
        embla.on("reInit", updateButtons)
    }, [embla, updateButtons])

    return (
        <div className={cn("relative w-full", className)}>
            <div ref={viewportRef} className="overflow-hidden">
                <div className="flex">{children}</div>
            </div>

            <Button
                size="icon"
                variant="outline"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
                onClick={() => embla?.scrollPrev()}
                disabled={!canPrev}
            >
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <Button
                size="icon"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
                onClick={() => embla?.scrollNext()}
                disabled={!canNext}
            >
                <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
    )
}
type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>

export function CarouselItem({ className, ...props }: CarouselItemProps) {
    return (
        <div
            className={cn("min-w-full shrink-0 grow-0", className)}
            {...props}
        />
    )
}
