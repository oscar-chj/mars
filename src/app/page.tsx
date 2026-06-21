import { Card } from "@/components/ui/card"
import { ArrowRight, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden bg-background py-12">
      {/* Decorative background grid and ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:14px_24px]" />

      {/* Hero / Explanation Section */}
      <div className="relative z-10 mx-auto max-w-4xl animate-in px-6 py-8 text-center duration-500 fade-in slide-in-from-top-4 md:py-16">
        <h1 className="py-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          MARS
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed sm:text-base">
          Merit Activity Records System
        </p>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Log community service hours, submit verifiable activity claims, earn
          merit awards, and track student achievements.
        </p>
      </div>

      {/* Cards Section */}
      <div className="relative z-10 mx-auto grid w-full max-w-3xl animate-in gap-6 px-6 pb-16 delay-150 duration-500 fade-in slide-in-from-bottom-4 sm:grid-cols-2">
        {/* Student Portal Card */}
        <Link href="/dashboard" className="group block h-full">
          <Card className="relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/20 hover:bg-muted/10 hover:shadow-md">
            <div className="space-y-5">
              {/* Icon with colored background */}
              <GraduationCap className="h-6 w-6" />
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Student Portal
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Log your service activities, upload proof certificates, and
                track your merit standing.
              </p>
            </div>

            {/* Card Action Link Footer */}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Card>
        </Link>

        {/* Admin Portal Card */}
        <Link href="/admin/claims" className="group block h-full">
          <Card className="relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/20 hover:bg-muted/10 hover:shadow-md">
            <div className="space-y-5">
              {/* Icon with user inside shield */}
              <Shield className="h-6 w-6" />
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                Admin Portal
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Review student claims, allocate merit points, and monitor system
                transaction logs.
              </p>
            </div>

            {/* Card Action Link Footer */}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Card>
        </Link>
      </div>
    </div>
  )
}
