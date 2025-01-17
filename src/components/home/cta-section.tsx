"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users who trust Healthcare+ for their healthcare
            needs. Start your journey to better health today.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className={cn("font-semibold hover:bg-white/90")}
              >
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "border-2 border-white text-white bg-transparent",
                  "hover:bg-white hover:text-blue-600"
                )}
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
