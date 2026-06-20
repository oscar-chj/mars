import { Card } from "@/components/ui/card"
import { ArrowRight, GraduationCap, Shield } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background overflow-hidden py-12">
      {/* Decorative background grid and ambient glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero / Explanation Section */}
      <div className="relative max-w-4xl px-6 py-8 mx-auto text-center md:py-16 z-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl font-extrabold tracking-tight py-4 sm:text-5xl md:text-6xl text-foreground">
          MARS
        </h1>
        <p className="max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Merit Activity Records System
        </p>
        <p className="max-w-xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed">
          Log community service hours, submit verifiable activity claims, earn merit awards, and track student achievements.
        </p>
      </div>

      {/* Cards Section */}
      <div className="relative grid w-full max-w-3xl gap-6 px-6 mx-auto sm:grid-cols-2 z-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
        {/* Student Portal Card */}
        <Link href="/dashboard" className="group block h-full">
          <Card className="relative flex flex-col justify-between p-6 h-full transition-all border border-border/80 bg-card hover:bg-muted/10 hover:border-primary/20 shadow-xs hover:shadow-md rounded-2xl cursor-pointer overflow-hidden">
            <div className="space-y-5">
              {/* Icon with colored background */}
              <GraduationCap className="w-6 h-6" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">Student Portal</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Log your service activities, upload proof certificates, and track your merit standing.
                </p>
            </div>
            
            {/* Card Action Link Footer */}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-300" />
          </Card>
        </Link>

        {/* Admin Portal Card */}
        <Link href="/admin/claims" className="group block h-full">
          <Card className="relative flex flex-col justify-between p-6 h-full transition-all border border-border/80 bg-card hover:bg-muted/10 hover:border-primary/20 shadow-xs hover:shadow-md rounded-2xl cursor-pointer overflow-hidden">
            <div className="space-y-5">
              {/* Icon with user inside shield */}
              <Shield className="w-6 h-6" />
              <h3 className="text-xl font-bold tracking-tight text-foreground">Admin Portal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review student claims, allocate merit points, and monitor system transaction logs.
              </p>
            </div>
            
            {/* Card Action Link Footer */}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-300" />
          </Card>
        </Link>
      </div>
    </div>
  )
}
