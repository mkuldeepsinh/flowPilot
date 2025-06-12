"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Shield, Zap, Globe, Smartphone, Clock, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into your business performance with comprehensive analytics and reporting tools.",
      color: "text-blue-600",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Seamlessly collaborate with your team members across different projects and departments.",
      color: "text-green-600",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption to keep your company data safe and secure.",
      color: "text-red-600",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance ensures your team can work efficiently without any delays or interruptions.",
      color: "text-yellow-600",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access your company data from anywhere in the world with our cloud-based infrastructure.",
      color: "text-purple-600",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Fully responsive design that works perfectly on all devices, from desktop to mobile.",
      color: "text-indigo-600",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Stay updated with real-time notifications and live data synchronization across all platforms.",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Growth Tracking",
      description: "Monitor your company's growth with detailed metrics and predictive analytics for future planning.",
      color: "text-teal-600",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage your company efficiently, all in one comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 hover:scale-105"
            >
              <CardHeader className="text-center">
                <div
                  className={`mx-auto mb-4 p-3 rounded-full bg-gray-100 group-hover:bg-white transition-colors w-fit`}
                >
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
