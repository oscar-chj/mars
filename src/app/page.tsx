import Link from "next/link"
import { Award, Shield, User, ArrowRight, CheckCircle, Trophy, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero / Explanation Section */}
      <div className="max-w-4xl px-4 py-12 mx-auto text-center md:py-20">
        <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-primary/10 text-primary">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
          Community Merits Platform
        </h1>
        <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground sm:text-xl">
          Recognizing and celebrating student contributions. Log community service, track achievements, earn merits, and inspire excellence within our institution via the Community Merits platform.
        </p>
      </div>

      {/* Cards Section */}
      <div className="grid w-full max-w-5xl gap-8 px-4 pb-16 mx-auto sm:grid-cols-2">
        {/* Student Portal Card */}
        <Card className="flex flex-col justify-between transition-all border shadow-sm hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Student Portal</CardTitle>
              <CardDescription>View and submit merit claims</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground">
              Access your personal dashboard to track cumulative merit points, submit new claims with proof certificates, and view your current position on the student leaderboard.
            </p>
          </CardContent>
          <CardFooter className="pt-4 border-t border-border/50">
            <Button asChild className="w-full justify-between cursor-pointer" size="lg">
              <Link href="/dashboard">
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Admin Portal Card */}
        <Card className="flex flex-col justify-between transition-all border shadow-sm hover:shadow-md hover:border-primary/20">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Admin Portal</CardTitle>
              <CardDescription>Review and verify claims</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground">
              Review pending community merit claims in real-time, inspect certificate uploads, allocate points, and monitor the audit logs and simulated email logs.
            </p>
          </CardContent>
          <CardFooter className="pt-4 border-t border-border/50">
            <Button asChild variant="outline" className="w-full justify-between cursor-pointer" size="lg">
              <Link href="/admin/claims">
                <span>Enter Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Info / Feature Highlights */}
      <div className="w-full border-t border-border bg-muted/30 py-12 md:py-16">
        <div className="max-w-5xl px-4 mx-auto">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-background border shadow-xs text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Log Activities</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Document volunteer service, cultural participations, athletic feats, and academic achievements.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-background border shadow-xs text-primary">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Verifiable Claims</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Admin review process ensures all submissions are backed by valid evidence, maintaining system integrity.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-background border shadow-xs text-primary">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-foreground">Public Leaderboard</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                See peer standings on a dynamic ranking table, encouraging robust community-minded engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
